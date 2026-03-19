/**
 * openmeteo.js — Fetches weather data from Open-Meteo API
 * Fixed date filtering and more robust error handling.
 */

const STATIONS = {
  sulmona: { name: 'Sulmona', lat: 42.049, lon: 13.930, altitude: 375, weatherUrl: 'https://www.3bmeteo.com/meteo/sulmona' },
  castel:  { name: 'Castel di Sangro', lat: 41.783, lon: 14.108, altitude: 793, weatherUrl: 'https://www.3bmeteo.com/meteo/castel+di+sangro' },
  campo:   { name: 'Campo di Giove', lat: 41.998, lon: 14.057, altitude: 1060, weatherUrl: 'https://www.3bmeteo.com/meteo/campo+di+giove' },
};

const VARS = 'temperature_2m,relative_humidity_2m,surface_pressure,precipitation';
const CURRENT_VARS = 'temperature_2m,relative_humidity_2m,surface_pressure,weather_code';
const AIR_QUALITY_VARS = ['european_aqi', 'carbon_dioxide', 'ammonia'];
const DEFAULT_TIMEOUT_MS = 12_000;

function formatLocalDate(value) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function fetchJson(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Open-Meteo status ${res.status}`);
    return await res.json();
  } catch (err) {
    // Normalize AbortError to a clearer message for UI flows.
    if (err?.name === 'AbortError') throw new Error('Open-Meteo timeout');
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

function getPeriodDates(period) {
  const now   = new Date();
  const today = formatLocalDate(now);

  const sub = (days) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return formatLocalDate(d);
  };

  switch (period) {
    case '2h':   return { start: sub(1),   end: today };
    case '24h':  return { start: sub(1),   end: today };
    case '7d':   return { start: sub(7),   end: today };
    case '30d':  return { start: sub(30),  end: today };
    case '1y':   return { start: sub(365), end: today };
    case '2y':   return { start: sub(730), end: today };
    default:     return { start: sub(7),   end: today };
  }
}

export async function fetchStationData(stationKey, period) {
  const { lat, lon } = STATIONS[stationKey];
  const { start, end } = getPeriodDates(period);

  let url;
  let airUrl;
  const isShort = (period === '2h' || period === '24h' || period === '7d');
  const windowHours = period === '2h' ? 2 : period === '24h' ? 24 : 7 * 24;

  if (isShort) {
    const pastDays = period === '2h' ? 1 : period === '24h' ? 2 : 8;
    url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
      + `&hourly=${VARS},weather_code&past_days=${pastDays}&forecast_days=1`
      + `&timezone=auto`;
    airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}`
      + `&hourly=${AIR_QUALITY_VARS.join(',')}&past_days=${pastDays}&forecast_days=1`
      + `&timezone=auto`;
  } else {
    url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}`
      + `&start_date=${start}&end_date=${end}`
      + `&daily=temperature_2m_mean,precipitation_sum,relative_humidity_2m_max,surface_pressure_max`
      + `&timezone=auto`;
    airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}`
      + `&hourly=${AIR_QUALITY_VARS.join(',')}&start_date=${start}&end_date=${end}`
      + `&timezone=auto`;
  }

  const [json, airJson] = await Promise.all([
    fetchJson(url, { timeoutMs: DEFAULT_TIMEOUT_MS }),
    fetchJson(airUrl, { timeoutMs: DEFAULT_TIMEOUT_MS }).catch(() => null),
  ]);

  if (isShort) {
    const h = json.hourly;
    const airHourly = airJson?.hourly ?? null;
    const endTime = new Date();
    endTime.setMinutes(0, 0, 0);
    const startTime = new Date(endTime);
    startTime.setHours(startTime.getHours() - windowHours);

    const indices = [];
    for (let i = 0; i < h.time.length; i++) {
      const t = new Date(h.time[i]);
      if (!Number.isFinite(t.getTime())) continue;
      if (t >= startTime && t <= endTime) indices.push(i);
    }

    // Fallback if timezone parsing/rounding ever yields an empty slice.
    if (!indices.length) {
      const count = Math.min(h.time.length, windowHours + 1);
      for (let i = h.time.length - count; i < h.time.length; i++) {
        if (i >= 0) indices.push(i);
      }
    }

    const airByTime = new Map();
    if (airHourly?.time?.length) {
      for (let i = 0; i < airHourly.time.length; i++) {
        const time = airHourly.time[i];
        const payload = {};
        AIR_QUALITY_VARS.forEach((key) => {
          payload[key] = airHourly?.[key]?.[i] ?? null;
        });
        airByTime.set(time, payload);
      }
    }
    const airQuality = indices.map((i) => airByTime.get(h.time[i])?.european_aqi ?? null);
    const co2 = indices.map((i) => airByTime.get(h.time[i])?.carbon_dioxide ?? null);
    const ammonia = indices.map((i) => airByTime.get(h.time[i])?.ammonia ?? null);

    return {
      times:         indices.map(i => h.time[i]),
      temperature:   indices.map(i => h.temperature_2m[i]),
      humidity:      indices.map(i => h.relative_humidity_2m[i]),
      airQuality,
      co2,
      ammonia,
      precipitation: indices.map(i => h.precipitation[i]),
    };
  } else {
    const d = json.daily;
    const airHourly = airJson?.hourly ?? null;
    const dailyBuckets = new Map();

    if (airHourly?.time?.length) {
      for (let i = 0; i < airHourly.time.length; i++) {
        const time = airHourly.time[i];
        const day = time.split('T')[0];
        if (!dailyBuckets.has(day)) dailyBuckets.set(day, {});
        const bucket = dailyBuckets.get(day);
        AIR_QUALITY_VARS.forEach((key) => {
          const value = airHourly?.[key]?.[i];
          if (!Number.isFinite(value)) return;
          if (!bucket[key]) bucket[key] = [];
          bucket[key].push(value);
        });
      }
    }

    const avgFor = (day, key) => {
      const values = dailyBuckets.get(day)?.[key];
      if (!values || !values.length) return null;
      const sum = values.reduce((acc, v) => acc + v, 0);
      return sum / values.length;
    };

    const airQuality = d.time.map((day) => avgFor(day, 'european_aqi'));
    const co2 = d.time.map((day) => avgFor(day, 'carbon_dioxide'));
    const ammonia = d.time.map((day) => avgFor(day, 'ammonia'));

    return {
      times:         d.time,
      temperature:   d.temperature_2m_mean,
      humidity:      d.relative_humidity_2m_max,
      airQuality,
      co2,
      ammonia,
      precipitation: d.precipitation_sum,
    };
  }
}

export async function fetchCurrentConditions() {
  const results = {};
  const settled = await Promise.allSettled(
    Object.entries(STATIONS).map(async ([key, { lat, lon, name }]) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=${CURRENT_VARS}&timezone=auto`;
      const json = await fetchJson(url, { timeoutMs: DEFAULT_TIMEOUT_MS });
      const current = json?.current;
      if (!current || !Number.isFinite(current.temperature_2m)) return;
      results[key] = {
        name,
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        pressure: current.surface_pressure,
        weatherCode: current.weather_code,
      };
    })
  );

  if (Object.keys(results).length === 0) {
    const allRejected = settled.every((entry) => entry.status === 'rejected');
    if (allRejected) {
      throw new Error('Open-Meteo unavailable');
    }
  }

  return results;
}

export { STATIONS };
