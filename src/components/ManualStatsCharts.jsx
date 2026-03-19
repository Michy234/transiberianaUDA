import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const SEASON_NAMES = ['Inverno', 'Primavera', 'Estate', 'Autunno'];
const COLORS = ['#f97316', '#22c55e', '#3b82f6', '#f43f5e'];

export default function ManualStatsCharts({ tourismData, seasonalStats, isItalian }) {
  const pieRef = useRef(null);
  const lineRef = useRef(null);
  const pieChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const tourismLegend = tourismData.map((item, index) => ({
    color: COLORS[index % COLORS.length],
    label: isItalian ? item.season.it : item.season.en,
    share: isItalian ? item.share.it : item.share.en,
  }));

  useEffect(() => {
    if (!pieRef.current) return;
    const labels = tourismData.map((item) => (isItalian ? item.season.it : item.season.en));
    const values = tourismData.map((item) => item.count);

    if (pieChartRef.current) pieChartRef.current.destroy();
    pieChartRef.current = new Chart(pieRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: COLORS,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { padding: 8 },
        },
      },
    });
  }, [tourismData, isItalian]);

  useEffect(() => {
    if (!lineRef.current) return;
    const stationStats = seasonalStats.sulmona || [];
    const averages = SEASON_NAMES.map((season) => {
      const entry = stationStats.find((item) => item.season.it === season);
      return entry ? (entry.min + entry.max) / 2 : 0;
    });

    if (lineChartRef.current) lineChartRef.current.destroy();
    lineChartRef.current = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels: SEASON_NAMES.map((season, index) => isItalian ? season : ['Winter', 'Spring', 'Summer', 'Autumn'][index]),
        datasets: [
          {
            label: isItalian ? 'Valori medi' : 'Average values',
            data: averages,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.25)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            suggestedMin: Math.min(...averages) - 3,
            suggestedMax: Math.max(...averages) + 3,
            ticks: { stepSize: 2 },
            grid: { color: 'rgba(255,255,255,0.06)' },
          },
          x: { grid: { display: false } },
        },
        plugins: {
          legend: { display: false },
          tooltip: { padding: 8 },
        },
      },
    });
  }, [seasonalStats, isItalian]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
        <div className="text-sm font-semibold text-muted-foreground mb-3">
          {isItalian ? 'Distribuzione turisti' : 'Tourists distribution'}
        </div>
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
          <div className="relative h-48">
            <canvas ref={pieRef} role="img" aria-label={isItalian ? 'Distribuzione turisti per stagione' : 'Tourists distribution by season'} />
          </div>
          <ul
            className="grid gap-2"
            aria-label={isItalian ? 'Legenda distribuzione turisti' : 'Tourists distribution legend'}
          >
            {tourismLegend.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border/50 bg-background/60 px-3 py-2"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                    aria-hidden="true"
                  />
                  {item.label}
                </span>
                <span className="text-xs text-muted-foreground text-right">
                  {item.share}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
        <div className="text-sm font-semibold text-muted-foreground mb-3">
          {isItalian ? 'Andamento temperature' : 'Temperature trend'}
        </div>
        <div className="relative h-40">
          <canvas ref={lineRef} role="img" aria-label={isItalian ? 'Grafico stagionale temperature' : 'Seasonal temperature chart'} />
        </div>
      </div>
    </div>
  );
}
