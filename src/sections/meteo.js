/**
 * meteo.js — Meteo section controller
 *
 * Orchestrates:
 * 1. Open-Meteo API calls for 3 stations
 * 2. Arduino JSON polling for real-time data
 * 3. Statistics (media, mediana, moda)
 * 4. Chart.js rendering with toggle controls
 * 5. Live card updates
 */

import { fetchStationData, fetchCurrentConditions }   from '../api/openmeteo.js';
import { startArduinoPolling }                         from '../api/arduino.js';
import { media, mediana, moda, minVal, maxVal, fmt }  from '../stats/calculator.js';
import { renderChart, updateVisibility, destroyChart } from '../charts/meteoChart.js';
import { updateFermataTemp }                            from './fermate.js';

const STATION_KEYS = ['sulmona', 'castel', 'campo'];
const STATION_NAMES = { sulmona: 'Sulmona', castel: 'Castel di Sangro', campo: 'Campo di Giove' };
const VAR_KEYS   = ['temperature', 'humidity', 'airQuality'];
const VAR_LABELS = { temperature: 'Temperatura', humidity: 'Umidità', airQuality: "Qualità dell'aria" };
const VAR_UNITS  = { temperature: '°C', humidity: '%', airQuality: 'AQI' };

// State
let currentPeriod = '7d';
let allData = {};
const visibility = {
  stations: new Set(STATION_KEYS),
  vars:     new Set(VAR_KEYS),
};

export async function initMeteo() {
  bindPeriodButtons();
  bindVarButtons();
  bindStationButtons();
  await loadAndRender(currentPeriod);
  initArduinoPolling();
  loadCurrentConditions();

  // Re-create the chart on theme changes to keep colors readable and stable.
  window.addEventListener('themechange', () => {
    if (!Object.keys(allData).length) return;
    destroyChart();
    renderChart(allData, visibility, currentPeriod);
  });
}

/* -------- Data Loading -------- */

function nextPaint() {
  return new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

async function loadAndRender(period) {
  showLoading(true);
  allData = {};

  try {
    const results = await Promise.allSettled(
      STATION_KEYS.map(k => fetchStationData(k, period).then(d => ({ key: k, data: d })))
    );

    results.forEach(r => {
      if (r.status === 'fulfilled') allData[r.value.key] = r.value.data;
    });

    const statusEl = document.getElementById('chart-status');
    const okCount = Object.keys(allData).length;
    if (statusEl) {
      if (okCount === 0) {
        const isFile = window.location.protocol === 'file:';
        statusEl.textContent = isFile
          ? 'Nessun dato dall’API: apri il sito tramite server (es. `npm run dev`).'
          : 'Nessun dato dall’API (temporaneamente non raggiungibile).';
      } else if (okCount < STATION_KEYS.length) {
        statusEl.textContent = `Dati parziali: ${okCount}/${STATION_KEYS.length} stazioni.`;
      } else {
        statusEl.textContent = '';
      }
    }

    destroyChart();
    renderChart(allData, visibility, period);
    renderStatsTable();

    // Ensure the chart is visible behind the overlay before we fade it out.
    await nextPaint();
  } finally {
    showLoading(false);
  }
}

/* -------- Current Conditions (live cards) -------- */

async function loadCurrentConditions() {
  try {
    const conditions = await fetchCurrentConditions();
    STATION_KEYS.forEach(k => {
      const c = conditions[k];
      if (!c) return;
      updateLiveCard(k, c.temperature, c.humidity, c.pressure);
      updateFermataTemp(k, c.temperature);
      // Hero badge
      if (k === 'castel') {
        const el = document.getElementById('hero-temp');
        if (el) el.textContent = c.temperature.toFixed(1) + '°C';
      }
    });
  } catch (e) { console.warn('Current conditions fetch failed:', e); }
}

/* -------- Arduino Polling -------- */

function initArduinoPolling() {
  startArduinoPolling((data, err) => {
    const dot  = document.getElementById('dot-castel');
    if (err) {
      if (dot) { dot.className = 'live-dot live-dot--error'; }
      return;
    }
    if (dot) dot.className = 'live-dot live-dot--ok';

    // Override Castel di Sangro card with Arduino data
    updateLiveCard('castel', data.temperature_c, data.humidity_pct, data.pressure_hpa);
    updateFermataTemp('castel', data.temperature_c);
    const el = document.getElementById('hero-temp');
    if (el) el.textContent = data.temperature_c.toFixed(1) + '°C';
  });
}

/* -------- Live Card DOM Updates -------- */

function updateLiveCard(key, temp, hum, pres) {
  const card = document.getElementById(`live-${key}`);
  if (card) card.classList.add('data-loaded');

  const dotEl = document.getElementById(`dot-${key}`);
  if (dotEl) dotEl.className = 'live-dot live-dot--ok';

  const tempEl = document.getElementById(`temp-${key}`);
  if (tempEl) tempEl.textContent = temp !== null ? temp.toFixed(1) + '°C' : '—';

  const humEl  = document.getElementById(`hum-${key}`);
  if (humEl)  humEl.textContent  = hum  !== null ? `💧 ${hum.toFixed(0)}%` : '💧 —';

  const presEl = document.getElementById(`pres-${key}`);
  if (presEl) presEl.textContent = pres !== null ? `🌬️ ${pres.toFixed(1)} hPa` : '🌬️ —';
}

/* -------- Stats Table -------- */

function renderStatsTable() {
  const tbody = document.getElementById('stats-tbody');
  if (!tbody) return;

  const activeStations = STATION_KEYS.filter(k => visibility.stations.has(k));
  const activeVars = VAR_KEYS.filter(k => visibility.vars.has(k));

  const statsByStation = {};
  for (const stKey of STATION_KEYS) {
    const stData = allData[stKey];
    statsByStation[stKey] = {};

    for (const varKey of VAR_KEYS) {
      const arr = stData?.[varKey] ?? [];
      const unit = VAR_UNITS[varKey];
      const dp   = 1;
      const mod  = moda(arr);
      const modaStr = mod
        ? (mod.length > 1 ? fmt(mod[0], unit, dp) + ' (+' + (mod.length - 1) + ')' : fmt(mod[0], unit, dp))
        : '—';

      statsByStation[stKey][varKey] = {
        media:   fmt(media(arr), unit, dp),
        mediana: fmt(mediana(arr), unit, dp),
        moda:    modaStr,
        min:     fmt(minVal(arr), unit, dp),
        max:     fmt(maxVal(arr), unit, dp),
      };
    }
  }

  const statRows = [
    { key: 'media',   label: 'Media',   primary: true },
    { key: 'mediana', label: 'Mediana' },
    { key: 'moda',    label: 'Moda' },
    { key: 'min',     label: 'Min' },
    { key: 'max',     label: 'Max' },
  ];

  const rows = [];
  for (const varKey of activeVars) {
    rows.push(`<tr class="stats-group-row"><td colspan="4">${VAR_LABELS[varKey]}</td></tr>`);
    for (const r of statRows) {
      const sul = activeStations.includes('sulmona') ? (statsByStation.sulmona?.[varKey]?.[r.key] ?? '—') : '—';
      const cas = activeStations.includes('castel') ? (statsByStation.castel?.[varKey]?.[r.key] ?? '—') : '—';
      const cam = activeStations.includes('campo') ? (statsByStation.campo?.[varKey]?.[r.key] ?? '—') : '—';
      rows.push(`
        <tr>
          <td class="${r.primary ? 'val-primary' : 'var-cell'}">${r.label}</td>
          <td>${sul}</td>
          <td>${cas}</td>
          <td>${cam}</td>
        </tr>
      `);
    }
  }

  tbody.innerHTML = rows.length ? rows.join('') : `<tr><td colspan="4" class="stats-loading">Seleziona almeno una misura.</td></tr>`;
}

/* -------- Toggle Controls -------- */

function bindPeriodButtons() {
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.dataset.period;
      await loadAndRender(currentPeriod);
    });
  });
}

function bindVarButtons() {
  document.querySelectorAll('.var-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.var;
      if (visibility.vars.has(v)) {
        // Don't hide if it's the last active variable
        if (visibility.vars.size === 1) return;
        visibility.vars.delete(v);
        btn.classList.remove('active');
      } else {
        visibility.vars.add(v);
        btn.classList.add('active');
      }
      updateVisibility(visibility);
      renderStatsTable();
    });
  });
}

function bindStationButtons() {
  document.querySelectorAll('.station-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = btn.dataset.station;
      if (visibility.stations.has(s)) {
        if (visibility.stations.size === 1) return;
        visibility.stations.delete(s);
        btn.classList.remove('active');
      } else {
        visibility.stations.add(s);
        btn.classList.add('active');
      }
      updateVisibility(visibility);
      renderStatsTable();
    });
  });
}

/* -------- Helpers -------- */

function showLoading(show) {
  const stage = document.getElementById('chart-stage');
  if (stage) stage.dataset.loading = show ? 'true' : 'false';
}
