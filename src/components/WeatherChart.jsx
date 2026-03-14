import { useEffect, useRef, useState, useCallback, useMemo, Fragment } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { format } from 'date-fns';
import { it as itLocale } from 'date-fns/locale';
import { fetchStationData, STATIONS } from '../api/openmeteo';

Chart.register(...registerables);

const CITY_OPTIONS = [
  { value: 'all', label: 'Tutte le città' },
  { value: 'sulmona', label: 'Sulmona' },
  { value: 'castel', label: 'Castel di Sangro' },
  { value: 'campo', label: 'Campo di Giove' },
];

const METRIC_OPTIONS = [
  { value: 'temperature', label: 'Temperatura (°C)', color: '#e63946' },
  { value: 'humidity', label: 'Umidità (%)', color: '#457b9d' },
  { value: 'pressure', label: 'Pressione (hPa)', color: '#2a9d8f' },
];

const PERIOD_OPTIONS = [
  { value: '24h', label: '24 ore' },
  { value: '7d', label: '7 giorni' },
  { value: '30d', label: '30 giorni' },
];

const CITY_COLORS = {
  sulmona: { border: '#6b9e7e', bg: 'rgba(107, 158, 126, 0.1)' },
  castel: { border: '#c9a227', bg: 'rgba(201, 162, 39, 0.1)' },
  campo: { border: '#e07a5f', bg: 'rgba(224, 122, 95, 0.1)' },
};

function LoadingBubbles() {
  return (
    <div className="flex gap-2" aria-label="Caricamento" role="status">
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

export default function WeatherChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [chartData, setChartData] = useState(null);

  const stats = useMemo(() => {
    if (!chartData?.length) return null;
    const scopedData =
      selectedCity === 'all'
        ? chartData
        : chartData.filter((cityData) => cityData.key === selectedCity);

    const metricBins = {
      temperature: (v) => Math.round(v * 10) / 10,
      humidity: (v) => Math.round(v),
      pressure: (v) => Math.round(v),
    };

    const collect = (metric) => {
      const values = [];
      scopedData.forEach((cityData) => {
        const series = cityData?.[metric];
        if (!Array.isArray(series)) return;
        series.forEach((v) => {
          if (Number.isFinite(v)) values.push(v);
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
    METRIC_OPTIONS.forEach(({ value: metric }) => {
      const values = collect(metric);
      const m = mean(values);
      const med = median(values);
      const mo = mode(values, metricBins[metric] ?? ((v) => v));
      byMetric[metric] = { n: values.length, mean: m, median: med, mode: mo };
    });

    return byMetric;
  }, [chartData, selectedCity]);

  const formatStat = (metric, value) => {
    if (value === null || value === undefined || !Number.isFinite(value)) return '—';
    switch (metric) {
      case 'temperature':
        return `${value.toFixed(1)}°C`;
      case 'humidity':
        return `${Math.round(value)}%`;
      case 'pressure':
        return `${Math.round(value)} hPa`;
      default:
        return String(value);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cities = Object.keys(STATIONS);
      const results = await Promise.all(
        cities.map(async (cityKey) => {
          const data = await fetchStationData(cityKey, selectedPeriod);
          return { key: cityKey, ...data };
        })
      );
      
      setChartData(results);
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

    chartData.forEach((cityData) => {
      if (selectedCity !== 'all' && cityData.key !== selectedCity) return;
      const cityColor = CITY_COLORS[cityData.key];
      
      const metricConfig = METRIC_OPTIONS.find(m => m.value === selectedMetric);
      const rawData = cityData[selectedMetric];
        
      const dataPoints = cityData.times.map((time, i) => ({
        x: new Date(time),
        y: rawData[i]
      }));

      const cityLabel = STATIONS[cityData.key]?.name || cityData.key;
      const label = selectedCity === 'all' 
        ? `${cityLabel} - ${metricConfig.label}`
        : metricConfig.label;

      datasets.push({
        label,
        data: dataPoints,
        borderColor: selectedCity === 'all' ? cityColor.border : metricConfig.color,
        backgroundColor: selectedCity === 'all' ? cityColor.bg : `${metricConfig.color}20`,
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
        fill: true,
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
                return selectedPeriod === '24h'
                  ? format(date, 'HH:mm', { locale: itLocale })
                  : format(date, 'dd MMM', { locale: itLocale });
              },
            },
          }
        },
        adapters: {
          date: {
            locale: itLocale,
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: selectedPeriod === '24h' ? 'hour' : 'day',
              tooltipFormat: selectedPeriod === '24h' ? 'HH:mm' : 'dd MMM',
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
  }, [chartData, selectedMetric, selectedPeriod, selectedCity]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-card border border-border font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          {CITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-card border border-border font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        >
          {PERIOD_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <div className="flex gap-2 items-center">
          {METRIC_OPTIONS.map(metric => (
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

      <div className="relative h-[400px] w-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <LoadingBubbles />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="text-center">
              <p className="text-destructive font-medium mb-2">Errore: {error}</p>
              <button onClick={loadData} className="text-sm text-primary hover:underline">Riprova</button>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="mt-6 bg-muted/30 border border-border rounded-2xl p-4 relative" aria-busy={loading ? 'true' : 'false'}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-2xl">
            <LoadingBubbles />
          </div>
        )}

        <div className="flex items-baseline justify-between gap-4 mb-3">
          <h3 className="font-semibold text-sm text-foreground">
            Statistiche ({selectedCity === 'all' ? 'tutte le città' : (STATIONS[selectedCity]?.name ?? selectedCity)})
          </h3>
          <div className="text-xs text-muted-foreground">Periodo: {PERIOD_OPTIONS.find(p => p.value === selectedPeriod)?.label ?? selectedPeriod}</div>
        </div>

        <div className="grid grid-cols-4 gap-3 text-xs">
          <div className="text-muted-foreground font-semibold">Valore</div>
          <div className="text-muted-foreground font-semibold">Moda</div>
          <div className="text-muted-foreground font-semibold">Media</div>
          <div className="text-muted-foreground font-semibold">Mediana</div>

          {METRIC_OPTIONS.map((m) => (
            <Fragment key={m.value}>
              <div className="font-semibold text-foreground">{m.label.split(' (')[0]}</div>
              <div className="text-foreground/90">{formatStat(m.value, stats?.[m.value]?.mode)}</div>
              <div className="text-foreground/90">{formatStat(m.value, stats?.[m.value]?.mean)}</div>
              <div className="text-foreground/90">{formatStat(m.value, stats?.[m.value]?.median)}</div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
