/**
 * calculator.js — Statistical functions (Media, Mediana, Moda)
 *
 * Used for the descriptive statistics table in the meteo dashboard.
 * All functions accept an array of numbers and ignore null/undefined.
 */

/**
 * Filter valid numeric values from an array.
 * @param {number[]} arr
 * @returns {number[]}
 */
function clean(arr) {
  return arr.filter(v => v !== null && v !== undefined && !isNaN(v));
}

/**
 * Media (Arithmetic Mean) — Σx / n
 * @param {number[]} arr
 * @returns {number|null}
 */
export function media(arr) {
  const a = clean(arr);
  if (a.length === 0) return null;
  return a.reduce((s, v) => s + v, 0) / a.length;
}

/**
 * Mediana (Median) — central value of sorted array
 * @param {number[]} arr
 * @returns {number|null}
 */
export function mediana(arr) {
  const a = [...clean(arr)].sort((x, y) => x - y);
  if (a.length === 0) return null;
  const mid = Math.floor(a.length / 2);
  return a.length % 2 === 1
    ? a[mid]
    : (a[mid - 1] + a[mid]) / 2;
}

/**
 * Moda (Mode) — most frequently occurring value (rounded to 1 decimal)
 * If multiple values have the same frequency, all are returned.
 * @param {number[]} arr
 * @returns {number[]|null}  array of modal value(s)
 */
export function moda(arr) {
  const a = clean(arr).map(v => Math.round(v * 10) / 10);
  if (a.length === 0) return null;

  const freq = {};
  for (const v of a) freq[v] = (freq[v] || 0) + 1;

  const maxFreq = Math.max(...Object.values(freq));
  const modes   = Object.entries(freq)
    .filter(([, f]) => f === maxFreq)
    .map(([v]) => parseFloat(v))
    .sort((x, y) => x - y);

  return modes;
}

/**
 * Min / Max helpers
 */
export function minVal(arr) {
  const a = clean(arr);
  return a.length ? Math.min(...a) : null;
}
export function maxVal(arr) {
  const a = clean(arr);
  return a.length ? Math.max(...a) : null;
}

/**
 * Format a number with units for display.
 * @param {number|null} v
 * @param {string} unit  e.g. '°C', '%', 'hPa'
 * @param {number} dp    decimal places
 */
export function fmt(v, unit = '', dp = 1) {
  if (v === null || v === undefined || isNaN(v)) return '—';
  return v.toFixed(dp) + (unit ? ' ' + unit : '');
}
