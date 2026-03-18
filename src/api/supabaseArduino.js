const SUPABASE_URL = import.meta.env.VITE_SUPA_URL || 'https://amhbcbfxoosnakvvhclw.supabase.co/rest/v1/sensor_data';
const SUPABASE_KEY = import.meta.env.VITE_SUPA_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtaGJjYmZ4b29zbmFrdnZoY2x3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODExMTIsImV4cCI6MjA4OTA1NzExMn0.X_xun96MRTFyFhKyMjfdXzfeDvFx6kkw4VivR88sjV8';

const DEFAULT_COLUMNS = ['temp', 'humidity', 'air_quality', 'created_at', 'co2', 'nh4', 'toluene'];

function getHeaders() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'count=exact',
  };
}

function parseTotal(contentRange) {
  if (!contentRange) return null;
  const parts = contentRange.split('/');
  if (parts.length < 2) return null;
  const total = Number(parts[1]);
  return Number.isFinite(total) ? total : null;
}

export async function fetchArduinoRecords({ limit = 50, offset = 0, columns = DEFAULT_COLUMNS } = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase configuration missing');
  }

  const select = encodeURIComponent(columns.join(','));
  const url = `${SUPABASE_URL}?select=${select}&order=created_at.desc&limit=${limit}&offset=${offset}`;

  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    throw new Error(`Supabase HTTP ${res.status}`);
  }

  const rows = await res.json();
  const total = parseTotal(res.headers.get('content-range'));

  return { rows, total };
}

export async function fetchArduinoSeries({ since, limit = 500, columns = DEFAULT_COLUMNS } = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase configuration missing');
  }

  const select = encodeURIComponent(columns.join(','));
  const sinceParam = since ? `&created_at=gte.${encodeURIComponent(since)}` : '';
  const url = `${SUPABASE_URL}?select=${select}&order=created_at.asc&limit=${limit}${sinceParam}`;

  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) {
    throw new Error(`Supabase HTTP ${res.status}`);
  }

  const rows = await res.json();
  return rows;
}
