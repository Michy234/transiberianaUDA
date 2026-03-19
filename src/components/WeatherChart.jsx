import { useEffect, useRef, useState, useCallback, useMemo, Fragment } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import { enUS, it as itLocale } from 'date-fns/locale';
import { fetchStationData, STATIONS } from '../api/openmeteo';
import { fetchArduinoSeries } from '../api/supabaseArduino';
import { useI18n } from '../i18n/index.jsx';

Chart.register(...registerables);
const CITY_COLORS = {
  sulmona: { border: '#6b9e7e', bg: 'rgba(107, 158, 126, 0.1)' },
  castel: { border: '#c9a227', bg: 'rgba(201, 162, 39, 0.1)' },
  campo: { border: '#e07a5f', bg: 'rgba(224, 122, 95, 0.1)' },
  arduino: { border: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)' },
};

const ARDUINO_KEY = 'arduino';

function LoadingBubbles({ label }) {
  return (
    <div className="flex gap-2" aria-label={label} role="status">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-3 h-3 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export default function WeatherChart({
  defaultCity = 'all',
  allowedCities = null,
  hideCitySelector = false,
  compact = false,
  hideStats = false,
}) {
  const { lang, t } = useI18n();
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(defaultCity);
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [chartData, setChartData] = useState(null);

  const dateLocale = lang === 'en' ? enUS : itLocale;
  const cityOptions = useMemo(
    () => [
      { value: 'all', label: t('meteo.chart.cities.all', 'Tutte le città') },
      { value: 'sulmona', label: 'Sulmona' },
      { value: 'castel', label: 'Castel di Sangro' },
      { value: 'campo', label: 'Campo di Giove' },
      { value: ARDUINO_KEY, label: t('meteo.chart.cities.arduino', 'Arduino') },
    ],
    [t],
  );

  const visibleCityOptions = useMemo(() => {
    if (!allowedCities) return cityOptions;
    return cityOptions.filter((opt) => allowedCities.includes(opt.value));
  }, [allowedCities, cityOptions]);

  useEffect(() => {
    setSelectedCity(defaultCity);
  }, [defaultCity]);

  const metricOptions = useMemo(
    () => [
      { value: 'temperature', label: t('meteo.chart.metrics.temperature', 'Temperatura (°C)'), color: '#e63946' },
      { value: 'humidity', label: t('meteo.chart.metrics.humidity', 'Umidità (%)'), color: '#457b9d' },
      { value: 'soilHumidity', label: t('meteo.chart.metrics.soilHumidity', 'Umidità terreno (%)'), color: '#0ea5e9' },
      { value: 'airQuality', label: t('meteo.chart.metrics.airQuality', "Qualità dell'aria (AQI)"), color: '#2a9d8f' },
      { value: 'co2', label: t('meteo.chart.metrics.co2', 'CO2 (ppm)'), color: '#8f4ae0' },
      { value: 'ammonia', label: t('meteo.chart.metrics.ammonia', 'NH3 (µg/m³)'), color: '#f59e0b' },
    ],
    [t],
  );

  const periodOptions = useMemo(
    () => [
      { value: '2h', label: t('meteo.chart.periods.2h', '2 ore') },
      { value: '24h', label: t('meteo.chart.periods.24h', '24 ore') },
      { value: '7d', label: t('meteo.chart.periods.7d', '7 giorni') },
      { value: '30d', label: t('meteo.chart.periods.30d', '30 giorni') },
    ],
    [t],
  );

  const stats = useMemo(() => {
    if (!chartData?.length) return null;
    const includeArduinoInAll = selectedMetric === 'soilHumidity';
    const scopedData =
      selectedCity === 'all'
        ? chartData.filter((cityData) => cityData.key !== ARDUINO_KEY || includeArduinoInAll)
        : chartData.filter((cityData) => cityData.key === selectedCity);

    const metricBins = {
      temperature: (v) => Math.round(v * 10) / 10,
      humidity: (v) => Math.round(v),
      soilHumidity: (v) => Math.round(v),
      airQuality: (v) => Math.round(v),
      co2: (v) => Math.round(v),
      ammonia: (v) => Math.round(v * 10) / 10,
    };

    const collect = (metric) => {
      const values = [];
      scopedData.forEach((cityData) => {
        const series = cityData?.[metric];
        if (!Array.isArray(series)) return;
        series.forEach((v) => {
          const num = typeof v === 'string' ? Number(v) : v;
          if (Number.isFinite(num)) values.push(num);
        });
      });
      return values;
    };

    const mean = (values) => {
      if (!values.length) return null;
      let sum = 0;
      for (const v of values) sum += v;
      return sum / values.length;
    };

    const median = (values) => {
      if (!values.length) return null;
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    };

    const mode = (values, binFn) => {
      if (!values.length) return null;
      const freq = new Map();
      for (const v of values) {
        const b = binFn(v);
        freq.set(b, (freq.get(b) ?? 0) + 1);
      }
      let bestValue = null;
      let bestCount = -1;
      for (const [value, count] of freq.entries()) {
        if (count > bestCount) {
          bestCount = count;
          bestValue = value;
        }
      }
      return bestValue;
    };

    const byMetric = {};
    metricOptions.forEach(({ value: metric }) => {
      const values = collect(metric);
      const m = mean(values);
      const med = median(values);
      const mo = mode(values, metricBins[metric] ?? ((v) => v));
      byMetric[metric] = { n: values.length, mean: m, median: med, mode: mo };
    });

    return byMetric;
  }, [chartData, metricOptions, selectedCity]);

  const formatStat = (metric, value) => {
    if (value === null || value === undefined || !Number.isFinite(value)) return '—';
    switch (metric) {
      case 'temperature':
        return `${value.toFixed(1)}°C`;
      case 'humidity':
        return `${Math.round(value)}%`;
      case 'soilHumidity':
        return `${Math.round(value)}%`;
      case 'airQuality':
        return `${Math.round(value)} AQI`;
      case 'co2':
        return `${Math.round(value)} ppm`;
      case 'ammonia':
        return `${(Math.round(value * 10) / 10).toFixed(1)} µg/m³`;
      default:
        return String(value);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const since = new Date(
        selectedPeriod === '2h'
          ? now.getTime() - 2 * 60 * 60 * 1000
          : selectedPeriod === '24h'
          ? now.getTime() - 24 * 60 * 60 * 1000
          : selectedPeriod === '7d'
            ? now.getTime() - 7 * 24 * 60 * 60 * 1000
            : now.getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString();

      const cities = Object.keys(STATIONS);
      const results = await Promise.all(
        cities.map(async (cityKey) => {
          const data = await fetchStationData(cityKey, selectedPeriod);
          return { key: cityKey, ...data };
        })
      );

      let arduinoData = null;
      try {
        let rows = await fetchArduinoSeries({ since, limit: 500 });
        const needsArduinoFallback =
          (!rows || rows.length === 0) &&
          (selectedCity === ARDUINO_KEY ||
            (Array.isArray(allowedCities) && allowedCities.length === 1 && allowedCities[0] === ARDUINO_KEY));

        if (needsArduinoFallback) {
          rows = await fetchArduinoSeries({ limit: 500 });
        }

        if (rows && rows.length) {
          arduinoData = {
            key: ARDUINO_KEY,
            times: rows.map((row) => row.created_at),
            temperature: rows.map((row) => row.temp),
            humidity: rows.map((row) => row.humidity),
            soilHumidity: rows.map((row) => row.soil_moisture ?? row.humidity ?? null),
            airQuality: rows.map((row) => row.air_quality),
            co2: rows.map((row) => row.co2),
            ammonia: rows.map((row) => row.nh4),
          };
        }
      } catch {
        arduinoData = null;
      }
      
      setChartData(arduinoData ? [...results, arduinoData] : results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!canvasRef.current || !chartData) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    const datasets = [];
    const showArduinoInAll = selectedMetric === 'soilHumidity';

    chartData.forEach((cityData) => {
      if (selectedCity === 'all' && cityData.key === ARDUINO_KEY && !showArduinoInAll) return;
      if (selectedCity !== 'all' && cityData.key !== selectedCity) return;
      const cityColor = CITY_COLORS[cityData.key];
      
      const metricConfig = metricOptions.find((m) => m.value === selectedMetric);
      const rawData = cityData[selectedMetric];
      if (!rawData || !cityData.times) return;
        
      const dataPoints = cityData.times.map((time, i) => ({
        x: new Date(time),
        y: rawData[i]
      }));

      const cityLabel = cityData.key === ARDUINO_KEY ? 'Arduino' : (STATIONS[cityData.key]?.name || cityData.key);
      const label = selectedCity === 'all' 
        ? `${cityLabel} - ${metricConfig.label}`
        : metricConfig.label;

      const baseColor = selectedCity === 'all' ? cityColor.border : metricConfig.color;
      const aboveFill = selectedCity === 'all' ? cityColor.bg : `${metricConfig.color}2b`;
      const belowFill = selectedCity === 'all' ? 'rgba(59,130,246,0.15)' : `${metricConfig.color}33`;

      datasets.push({
        label,
        data: dataPoints,
        borderColor: baseColor,
        backgroundColor: (ctx) => {
          const { chart } = ctx;
          const { ctx: c } = chart;
          const gradient = c.createLinearGradient(0, 0, 0, chart.height);
          gradient.addColorStop(0, aboveFill);
          gradient.addColorStop(0.5, aboveFill);
          gradient.addColorStop(0.5, belowFill);
          gradient.addColorStop(1, belowFill);
          return gradient;
        },
        borderWidth: 2.5,
        clip: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
        pointHitRadius: 6,
        tension: 0.25,
        cubicInterpolationMode: 'monotone',
        capBezierPoints: true,
        borderCapStyle: 'round',
        borderJoinStyle: 'round',
        fill: {
          target: 'origin',
          above: aboveFill,
          below: belowFill,
        },
      });
    });

    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { family: 'Quicksand', size: 12 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: 'rgba(0,0,0,0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: { family: 'Quicksand', size: 14, weight: 'bold' },
            bodyFont: { family: 'Quicksand', size: 12 },
            callbacks: {
              title: (items) => {
                const x = items?.[0]?.parsed?.x;
                if (x === null || x === undefined) return '';
                const date = new Date(x);
                return selectedPeriod === '24h' || selectedPeriod === '2h'
                  ? format(date, 'HH:mm', { locale: dateLocale })
                  : format(date, 'dd MMM', { locale: dateLocale });
              },
            },
          }
        },
        adapters: {
          date: {
            locale: dateLocale,
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: selectedPeriod === '7d' || selectedPeriod === '30d' ? 'day' : 'hour',
              tooltipFormat: selectedPeriod === '24h' || selectedPeriod === '2h' ? 'HH:mm' : 'dd MMM',
              displayFormats: {
                hour: 'HH:mm',
                day: 'dd MMM'
              }
            },
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { family: 'Quicksand', size: 11 } }
          },
          y: {
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { family: 'Quicksand', size: 11 } }
          }
        }
      }
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [allowedCities, chartData, dateLocale, metricOptions, selectedMetric, selectedPeriod, selectedCity]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 mb-6">
        {!hideCitySelector && (
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-card border border-border font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          >
            {visibleCityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        )}

        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-card border border-border font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          {periodOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <div className="flex gap-2 items-center">
          {metricOptions.map((metric) => (
            <button
              key={metric.value}
              onClick={() => setSelectedMetric(metric.value)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                selectedMetric === metric.value
                  ? 'text-white shadow-md'
                  : 'bg-card border border-border text-muted-foreground hover:bg-muted'
              }`}
              style={selectedMetric === metric.value ? { backgroundColor: metric.color } : {}}
            >
              {metric.label.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className={`relative w-full ${compact ? 'h-[260px]' : 'h-[400px]'}`}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <LoadingBubbles label={t('meteo.chart.loading', 'Caricamento')} />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-center">
              <p className="text-destructive font-medium mb-2">{t('meteo.chart.error', 'Errore')}: {error}</p>
              <button onClick={loadData} className="text-sm text-primary hover:underline">{t('meteo.retry', 'Riprova')}</button>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {!hideStats && (
        <div className="mt-6 bg-muted/30 border border-border rounded-2xl p-4 relative" aria-busy={loading ? 'true' : 'false'}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-2xl">
            <LoadingBubbles label={t('meteo.chart.loading', 'Caricamento')} />
          </div>
        )}

        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h3 className="font-semibold text-sm text-foreground">
            {t('meteo.chart.stats.title', 'Statistiche')} ({selectedCity === 'all' ? t('meteo.chart.cities.allLower', 'tutte le città') : (selectedCity === ARDUINO_KEY ? 'Arduino' : (STATIONS[selectedCity]?.name ?? selectedCity))})
          </h3>
          <div className="text-xs text-muted-foreground">{t('meteo.chart.period', 'Periodo')}: {periodOptions.find((p) => p.value === selectedPeriod)?.label ?? selectedPeriod}</div>
        </div>

        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="text-muted-foreground font-semibold">{t('meteo.chart.stats.value', 'Valore')}</div>
          <div className="text-muted-foreground font-semibold">{t('meteo.chart.stats.mode', 'Moda')}</div>
          <div className="text-muted-foreground font-semibold">{t('meteo.chart.stats.mean', 'Media')}</div>
          <div className="text-muted-foreground font-semibold">{t('meteo.chart.stats.median', 'Mediana')}</div>

          {metricOptions.map((m) => (
            <Fragment key={m.value}>
              <div className="font-semibold text-foreground">{m.label.split(' (')[0]}</div>
              <div className="text-foreground/90">{formatStat(m.value, stats?.[m.value]?.mode)}</div>
              <div className="text-foreground/90">{formatStat(m.value, stats?.[m.value]?.mean)}</div>
              <div className="text-foreground/90">{formatStat(m.value, stats?.[m.value]?.median)}</div>
            </Fragment>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}
