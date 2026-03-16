/**
 * meteoChart.js — Chart.js multi-line chart for the meteo dashboard
 * Fixed version using npm imports and date-fns adapter.
 */

import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { it } from 'date-fns/locale';

// Color palette per station - Refined for both light and dark themes
export const STATION_COLORS = {
  sulmona: { temp: '#f97316', humidity: '#fb923c', airQuality: '#f97316' }, // Orange
  castel:  { temp: '#0ea5e9', humidity: '#38bdf8', airQuality: '#0ea5e9' }, // Cyan/Blue
  campo:   { temp: '#8b5cf6', humidity: '#a78bfa', airQuality: '#8b5cf6' }, // Purple
};

// Variable config
export const VAR_CONFIG = {
  temperature: { label: 'Temperatura (°C)',   unit: '°C',  yAxisId: 'yTemp' },
  humidity:    { label: 'Umidità (%)',         unit: '%',   yAxisId: 'yHum'  },
  airQuality:  { label: "Qualità dell'aria (AQI)", unit: ' AQI', yAxisId: 'yAqi' },
};

let chartInstance = null;

function cssVar(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function themeTokens() {
  return {
    bgCard: cssVar('--bg-card', '#141920'),
    text: cssVar('--text-primary', '#e8eaf0'),
    text2: cssVar('--text-secondary', '#9aa5b8'),
    text3: cssVar('--text-muted', '#5a6a7e'),
    grid: cssVar('--border-subtle', 'rgba(255,255,255,0.07)'),
    border: cssVar('--border-strong', 'rgba(255,255,255,0.12)'),
  };
}

function buildThemeOptions() {
  const t = themeTokens();
  return {
    tooltipBg: t.bgCard,
    tooltipBorder: t.border,
    tooltipTitle: t.text,
    tooltipBody: t.text2,
    tick: t.text3,
    grid: t.grid,
    axis: t.border,
  };
}

function makeDataset(stationKey, varKey, times, values, visible) {
  const color = STATION_COLORS?.[stationKey]?.[varKey] || '#f39c12';
  return {
    label:           `${stationKey}_${varKey}`,
    data:            values.map((v, i) => ({ x: times[i], y: v })),
    borderColor:     color,
    backgroundColor: color + '22',
    pointBorderColor: color,
    pointBackgroundColor: color,
    borderWidth:     2,
    pointRadius:     times.length > 200 ? 0 : 2,
    pointHoverRadius: 4,
    tension:         0.35,
    fill:            false,
    spanGaps:        true,
    yAxisID:         VAR_CONFIG[varKey].yAxisId,
    hidden:          !visible,
  };
}

export function renderChart(allData, visibility, period) {
  const canvas = document.getElementById('meteoChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const th = buildThemeOptions();

  const datasets = [];
  for (const [stKey, stData] of Object.entries(allData)) {
    if (!stData) continue;
    for (const varKey of ['temperature', 'humidity', 'airQuality']) {
      const visible = visibility.stations.has(stKey) && visibility.vars.has(varKey);
      datasets.push(
        makeDataset(stKey, varKey, stData.times, stData[varKey] ?? [], visible)
      );
    }
  }

  if (chartInstance) {
    chartInstance.data.datasets = datasets;
    chartInstance.update('none');
    return;
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      animation: { duration: 500 },
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      elements: {
        line: { borderJoinStyle: 'round', borderCapStyle: 'round' },
        point: { hitRadius: 10 },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: th.tooltipBg,
          borderColor: th.tooltipBorder,
          borderWidth: 1,
          padding: 12,
          titleColor: th.tooltipTitle,
          bodyColor: th.tooltipBody,
          callbacks: {
            title: items => {
              const d = new Date(items[0].parsed.x);
              return d.toLocaleString('it-IT');
            },
            label: item => {
              const [stKey, varKey] = item.dataset.label.split('_');
              const names = { sulmona: 'Sulmona', castel: 'Castel di Sangro', campo: 'Campo di Giove' };
              const units = { temperature: '°C', humidity: '%', airQuality: ' AQI' };
              return ` ${names[stKey]} ${varKey}: ${item.parsed.y?.toFixed(1) ?? '—'}${units[varKey]}`;
            },
          },
        },
      },
      scales: {
        x: {
          type: 'time',
          adapters: { 
            date: { locale: it } 
          },
          ticks: { color: th.tick, maxTicksLimit: 8, maxRotation: 0 },
          grid: { color: th.grid },
          border: { color: th.axis },
        },
        yTemp: {
          type: 'linear', position: 'left',
          ticks: { color: '#f97316', callback: v => v.toFixed(0) + '°C' },
          grid: { color: 'rgba(249,115,22,0.08)' },
          border: { color: 'rgba(249,115,22,0.2)' },
          title: { display: true, text: '°C', color: '#f97316' },
        },
        yHum: {
          type: 'linear', position: 'right',
          ticks: { color: '#22d3ee', callback: v => v.toFixed(0) + '%' },
          grid: { drawOnChartArea: false },
          border: { color: 'rgba(34,211,238,0.2)' },
          title: { display: true, text: '%', color: '#22d3ee' },
        },
        yAqi: {
          type: 'linear', position: 'right',
          ticks: { color: '#a78bfa', callback: v => v.toFixed(0) },
          grid: { drawOnChartArea: false },
          border: { color: 'rgba(167,139,250,0.2)' },
          title: { display: true, text: 'AQI', color: '#a78bfa' },
        },
      },
    },
  });
}

export function updateVisibility(visibility) {
  if (!chartInstance) return;
  chartInstance.data.datasets.forEach(ds => {
    const [stKey, varKey] = ds.label.split('_');
    ds.hidden = !(visibility.stations.has(stKey) && visibility.vars.has(varKey));
  });
  chartInstance.update();
}

export function destroyChart() {
  if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
}
