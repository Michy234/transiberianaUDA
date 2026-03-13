/**
 * arduino.js — Polling module for live Arduino sensor data
 *
 * The Arduino updates /data/arduino.json every 60 seconds via HTTP POST.
 * This module fetches that file every 30 seconds and calls a callback
 * with the latest values.
 *
 * Expected JSON schema:
 * {
 *   "timestamp":    "2026-03-13T10:00:00Z",
 *   "station":      "Castel di Sangro",
 *   "temperature_c": 3.4,
 *   "humidity_pct":  78,
 *   "pressure_hpa":  1013.2
 * }
 */

const ARDUINO_JSON_PATH = '/data/arduino.json';
const POLL_INTERVAL_MS  = 30_000;  // 30 seconds

let _timer = null;

/**
 * Start polling the Arduino JSON file.
 * @param {(data: object|null, error: Error|null) => void} callback
 */
export function startArduinoPolling(callback) {
  const poll = async () => {
    try {
      const res  = await fetch(ARDUINO_JSON_PATH + '?t=' + Date.now());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      callback(data, null);
    } catch (err) {
      callback(null, err);
    }
  };

  poll();  // immediate first call
  _timer = setInterval(poll, POLL_INTERVAL_MS);
}

/** Stop the polling loop (call on component unmount / page unload). */
export function stopArduinoPolling() {
  if (_timer) { clearInterval(_timer); _timer = null; }
}
