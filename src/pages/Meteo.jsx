import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Wind, Thermometer, MapPin, Leaf, CloudSun, Sun, Cloud, Snowflake } from '@phosphor-icons/react';
import { useTheme } from '../components/ThemeContext';
import WeatherChart from '../components/WeatherChart';
import { fetchCurrentConditions, STATIONS } from '../api/openmeteo';
import { fetchArduinoRecords } from '../api/supabaseArduino';
import { useI18n } from '../i18n/index.jsx';
import ImageCredit from '../components/ImageCredit';
import ManualStatsCharts from '../components/ManualStatsCharts';

/* ——— States ——— */
const STATES = { LOADING: 'loading', READY: 'ready', ERROR: 'error', EMPTY: 'empty' };

const CITY_PHOTOS = {
  sulmona: '/photos/fermate/sulmona-fermata.webp',
  castel: '/photos/fermate/castel-di-sangro.webp',
  campo: '/photos/fermate/campo-di-giove.webp',
};

const SEASONAL_STATS = {
  sulmona: [
    { season: { it: 'Inverno', en: 'Winter' }, min: -3, max: 13, note: { it: 'picchi notturni fino a -9°C (gennaio)', en: 'night lows down to -9°C (Jan)' } },
    { season: { it: 'Primavera', en: 'Spring' }, min: 5, max: 22, note: { it: 'fino a 25–27°C a fine maggio', en: 'up to 25–27°C in late May' } },
    { season: { it: 'Estate', en: 'Summer' }, min: 15, max: 34, note: { it: 'picchi 35–37°C in luglio/agosto', en: 'peaks 35–37°C in Jul/Aug' } },
    { season: { it: 'Autunno', en: 'Autumn' }, min: 4, max: 24, note: { it: 'settembre quasi estivo, gelate a fine novembre', en: 'September still warm, first frosts by late November' } },
  ],
  campo: [
    { season: { it: 'Inverno', en: 'Winter' }, min: -3, max: 7, note: { it: 'picchi rigidi fino a -7°C', en: 'cold snaps down to -7°C' } },
    { season: { it: 'Primavera', en: 'Spring' }, min: 3, max: 15, note: { it: 'fino a 22°C a fine maggio', en: 'up to 22°C in late May' } },
    { season: { it: 'Estate', en: 'Summer' }, min: 14, max: 28 },
    { season: { it: 'Autunno', en: 'Autumn' }, min: 5, max: 16, note: { it: 'freddo in arrivo a fine novembre', en: 'colder by late November' } },
  ],
  castel: [
    { season: { it: 'Inverno', en: 'Winter' }, min: -4, max: 14, note: { it: 'notti fino a -6°C', en: 'nights down to -6°C' } },
    { season: { it: 'Primavera', en: 'Spring' }, min: 4, max: 18, note: { it: 'picchi oltre 20°C a maggio', en: 'over 20°C in May' } },
    { season: { it: 'Estate', en: 'Summer' }, min: 12, max: 30, note: { it: 'picchi 32–33°C', en: 'peaks 32–33°C' } },
    { season: { it: 'Autunno', en: 'Autumn' }, min: 2, max: 22 },
  ],
};

const TOURISM_NUMBERS = [
  { season: { it: 'Inverno', en: 'Winter' }, count: 18000, share: { it: 'circa 50% del totale', en: 'about 50% of total' } },
  { season: { it: 'Primavera', en: 'Spring' }, count: 5500, share: { it: 'circa 15% del totale', en: 'about 15% of total' } },
  { season: { it: 'Estate', en: 'Summer' }, count: 5500, share: { it: 'circa 15% del totale', en: 'about 15% of total' } },
  { season: { it: 'Autunno', en: 'Autumn' }, count: 9000, share: { it: 'circa 25% del totale', en: 'about 25% of total' } },
];

const TOURISM_SENTIMENT = {
  it: {
    title: 'Cosa dicono i viaggiatori',
    summary: "Tra l'85% e il 90% delle recensioni valuta l'esperienza come eccellente o molto buona, con medie tra 4 e 4,5 stelle sui principali portali.",
    highlightsTitle: 'Punti forti ricorrenti',
    highlights: [
      "atmosfera d'altri tempi e carrozze storiche",
      'panorami e foto senza riflessi dai finestrini apribili',
      'guide e intrattenimento a bordo',
      'ritmo slow e relax',
    ],
    cautionsTitle: 'Cose da sapere prima di partire',
    cautions: [
      'ritardi possibili su linea storica',
      'comfort vintage con sedili rigidi',
      'affollamento durante eventi speciali',
    ],
  },
  en: {
    title: 'What travelers say',
    summary: 'Around 85–90% of reviews rate the experience as excellent or very good, with averages between 4 and 4.5 stars on major platforms.',
    highlightsTitle: 'Most loved',
    highlights: [
      'historic atmosphere and vintage carriages',
      'panoramas and photos from openable windows',
      'guides and onboard storytelling',
      'slow travel mindset',
    ],
    cautionsTitle: 'Good to know',
    cautions: [
      'delays can happen on a historic line',
      'vintage comfort with hard seats',
      'crowds during special events',
    ],
  },
};

function getWeatherIcon(code) {
  if (code <= 0) return <Sun size={48} weight="duotone" className="text-amber-500" />;
  if (code <= 3) return <CloudSun size={48} weight="duotone" className="text-blue-400" />;
  if (code <= 48) return <Cloud size={48} weight="duotone" className="text-slate-400" />;
  if (code <= 67) return <CloudRain size={48} weight="duotone" className="text-blue-500" />;
  return <Snowflake size={48} weight="duotone" className="text-cyan-300" />;
}

function CityWeatherCard({ city, data, delay, t, isItalian }) {
  const weatherCode = data?.weatherCode ?? 0;
  const photoSrc = CITY_PHOTOS[city.key];
  const hasTemperature = Number.isFinite(data?.temperature);
  
  return (
    <motion.a
      href={city.weatherUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100, damping: 20 }}
      className="relative block overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[var(--shadow-card)] transition-all duration-300 group hover:scale-[1.02] hover:shadow-[var(--shadow-card-hover)]"
    >
      {photoSrc && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <img
            src={photoSrc}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-34 blur-[3px] transition-all duration-700 group-hover:scale-110 group-hover:opacity-42"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card/96 via-card/88 to-card/52" />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(107,158,126,0.16),transparent_34%)]" aria-hidden="true" />
      <div className="relative z-10 flex min-h-[300px] flex-col justify-between p-6">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-card/80 px-4 py-2 text-sm font-semibold text-primary shadow-[var(--shadow-subtle)] backdrop-blur-xl">
            <MapPin size={16} className="text-primary" weight="fill" />
            {isItalian ? 'Stazione meteo' : 'Weather station'}
          </div>
          <div className="mb-5">
            <div className="text-sm font-semibold italic text-muted-foreground">
              {isItalian ? 'Condizioni attuali' : 'Current conditions'}
            </div>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-card/76 shadow-[var(--shadow-subtle)] backdrop-blur-xl">
                {getWeatherIcon(weatherCode)}
              </div>
              <div className="text-5xl font-bold tracking-tighter text-foreground sm:text-6xl" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {hasTemperature ? `${data.temperature.toFixed(1)}°C` : '—'}
              </div>
            </div>
          </div>
          <h3 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            {city.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {city.altitude}m
          </p>
        </div>
        <div className="rounded-3xl border border-border/60 bg-card/72 p-4 shadow-[var(--shadow-subtle)] backdrop-blur-xl">
          <div className="flex flex-wrap gap-3">
            <div className="flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl bg-background/58 px-3 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CloudRain size={16} />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {isItalian ? 'Umidità' : 'Humidity'}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {data?.humidity ?? '—'}%
                </div>
              </div>
            </div>
            <div className="flex min-w-[140px] flex-1 items-center gap-3 rounded-2xl bg-background/58 px-3 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Wind size={16} />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {isItalian ? 'Pressione' : 'Pressure'}
                </div>
                <div className="text-sm font-semibold text-foreground">
                  {data?.pressure ?? '—'} hPa
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            {t('meteo.cards.forecastCta', 'Clicca per previsioni complete')}
          </p>
        </div>
      </div>
      {photoSrc ? (
        <ImageCredit
          src={photoSrc}
          className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-[10px] text-white/90"
          linkClassName="text-white/90 hover:text-white"
        />
      ) : null}
    </motion.a>
  );
}

function LoadingState({ isDark, t }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-muted-foreground" role="status" aria-label={t('meteo.loading.aria', 'Caricamento dati meteo')}>
      <div className="relative w-24 h-24">
        {isDark ? (
          /* Dark: Fireplace flames */
          <>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute text-accent-warm animate-fireplace"
                style={{ 
                  left: `${15 + i * 28}%`, 
                  bottom: '10%',
                  animationDelay: `${i * 0.4}s`,
                  fontSize: `${20 + i * 4}px`
                }}
                aria-hidden="true"
              >🔥</span>
            ))}
          </>
        ) : (
          /* Light: Snowflakes */
          <>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="absolute text-primary/40 animate-snowfall"
                style={{ 
                  left: `${20 + i * 25}%`, 
                  animationDelay: `${i * 0.8}s`,
                  fontSize: `${16 + i * 4}px`
                }}
                aria-hidden="true"
              >❄</span>
            ))}
          </>
        )}
      </div>
      <p className="font-medium text-lg">
        {isDark ? t('meteo.loading.dark', 'Riscaldando i sensori...') : t('meteo.loading.light', 'Raccogliendo i dati dai sensori...')}
      </p>
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-primary/30 animate-gentle-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ isDark, t }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center px-6" role="status">
      <div className="text-5xl mb-2" aria-hidden="true">{isDark ? '🦉' : '🐰'}</div>
      <h3 className="text-xl font-bold text-foreground">{t('meteo.empty.title', 'Nessun dato disponibile')}</h3>
      <p className="text-muted-foreground max-w-md leading-relaxed">
        {isDark 
          ? t('meteo.empty.dark', 'I sensori della stazione dormono profondamente. Il gufo meteorologo sta sorvegliando. Riprova tra qualche minuto.')
          : t('meteo.empty.light', 'I sensori della stazione stanno dormendo. Riprova tra qualche minuto, il coniglietto meteorologo è al lavoro.')
        }
      </p>
    </div>
  );
}

function ErrorState({ isDark, onRetry, t }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center px-6" role="alert">
      <div className="relative">
        {isDark ? (
          <span className="text-4xl animate-candle" aria-hidden="true">🕯️</span>
        ) : (
          <Leaf size={48} className="text-destructive/60 animate-leaf-fall" weight="duotone" />
        )}
      </div>
      <h3 className="text-xl font-bold text-foreground">{t('meteo.error.title', 'Connessione persa')}</h3>
      <p className="text-muted-foreground max-w-md leading-relaxed">
        {isDark 
          ? t('meteo.error.dark', 'La candela si è spenta, non riusciamo a raggiungere i sensori. Controlla la connessione e riprova.')
          : t('meteo.error.light', 'Non riusciamo a raggiungere i sensori IoT. Controlla la connessione e riprova.')
        }
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[var(--shadow-button)]"
        >
          {t('meteo.retry', 'Riprova')}
        </button>
      )}
    </div>
  );
}

/* ——— MeteoCard ——— */
function MeteoCard({ delay, title, value, icon, desc, className = '' }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100, damping: 20 }}
      className={`bg-card p-8 rounded-3xl shadow-[var(--shadow-card)] relative overflow-hidden group hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02] transition-all duration-300 ${className}`}
      role="region"
      aria-label={`${title}: ${value}`}
    >
      <div className="absolute top-4 right-4 text-primary/[0.06] group-hover:scale-110 group-hover:text-primary/[0.1] transition-all duration-500" aria-hidden="true">
        {icon}
      </div>
      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 italic">{title}</h3>
        <div className="text-5xl font-bold tracking-tighter mb-4 text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </motion.article>
  );
}

export default function Meteo() {
  const [weatherData, setWeatherData] = useState({});
  const [state, setState] = useState(STATES.LOADING);
  const [showExtraStats, setShowExtraStats] = useState(false);
  const [showArduinoDebug, setShowArduinoDebug] = useState(false);
  const [arduinoRows, setArduinoRows] = useState([]);
  const [arduinoLoading, setArduinoLoading] = useState(false);
  const [arduinoError, setArduinoError] = useState(null);
  const { isDark } = useTheme();
  const { t, lang } = useI18n();
  const isItalian = lang === 'it';

  const cities = [
    { key: 'sulmona', ...STATIONS.sulmona },
    { key: 'castel', ...STATIONS.castel },
    { key: 'campo', ...STATIONS.campo },
  ];

  const loadData = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setState(STATES.LOADING);
    }

    try {
      const data = await fetchCurrentConditions();
      setWeatherData(data);
      setState(Object.keys(data).length > 0 ? STATES.READY : STATES.EMPTY);
    } catch (err) {
      if (!silent) {
        setWeatherData({});
        setState(STATES.ERROR);
      }
    }
  }, []);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      loadData();
    }, 1000);

    return () => window.clearTimeout(loadTimer);
  }, [loadData]);

  useEffect(() => {
    if (state !== STATES.READY) return;
    const interval = window.setInterval(() => {
      loadData({ silent: true });
    }, 60000);
    return () => window.clearInterval(interval);
  }, [loadData, state]);

  const formatTimestamp = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat(isItalian ? 'it-IT' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const loadArduino = async (reset = false) => {
    try {
      setArduinoLoading(true);
      setArduinoError(null);
      const offset = reset ? 0 : arduinoRows.length;
      const { rows } = await fetchArduinoRecords({ limit: 50, offset });
      setArduinoRows((prev) => (reset ? rows : [...prev, ...rows]));
    } catch (err) {
      setArduinoError(err?.message || 'Errore Supabase');
    } finally {
      setArduinoLoading(false);
    }
  };

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (!showArduinoDebug) return;
    if (arduinoRows.length > 0) return;
    loadArduino(true);
  }, [arduinoRows.length, showArduinoDebug]);

  useEffect(() => {
    if (!import.meta.env.DEV || typeof window === 'undefined') return;
    const toggleFn = () => setShowArduinoDebug((prev) => !prev);
    window.demo = window.demo || {};
    window.demo.toggle = toggleFn;
    return () => {
      if (window.demo?.toggle === toggleFn) {
        delete window.demo.toggle;
      }
    };
  }, []);

  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/8 text-primary text-sm font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-gentle-pulse" aria-hidden="true"></span>
            {t('meteo.badge', 'Dati live')}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-[-0.03em] text-foreground mb-2">{t('meteo.title', 'Meteo live')}</h1>
          <p className="text-lg text-muted-foreground max-w-[55ch]">{t('meteo.subtitle', "Condizioni meteorologiche in tempo reale lungo la Transiberiana d'Abruzzo.")}</p>
        </motion.div>
      </div>

      {/* Content with states */}
      <AnimatePresence mode="wait">
        {state === STATES.LOADING && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingState isDark={isDark} t={t} />
          </motion.div>
        )}
        
        {state === STATES.ERROR && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorState isDark={isDark} t={t} onRetry={() => loadData()} />
          </motion.div>
        )}

        {state === STATES.EMPTY && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState isDark={isDark} t={t} />
          </motion.div>
        )}

        {state === STATES.READY && (
          <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* City Weather Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {cities.map((city, index) => (
                <CityWeatherCard 
                  key={city.key} 
                  city={city} 
                  data={weatherData[city.key]} 
                  delay={0.1 + index * 0.1}
                  t={t}
                  isItalian={isItalian}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                type="button"
                onClick={() => setShowExtraStats((prev) => !prev)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-[var(--shadow-subtle)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background"
              >
                {showExtraStats
                  ? (isItalian ? 'Nascondi statistiche manuali' : 'Hide manual stats')
                  : (isItalian ? 'Mostra statistiche manuali' : 'Show manual stats')}
              </button>
            </div>

            {import.meta.env.DEV && showArduinoDebug && (
              <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, type: 'spring', stiffness: 120, damping: 22 }}
                className="mb-8"
              >
                <div className="bg-card rounded-3xl p-6 md:p-8 shadow-[var(--shadow-card)] border border-border/30">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="text-sm font-semibold text-muted-foreground">
                      {isItalian ? 'Debug Arduino (console: demo.toggle())' : 'Arduino debug (console: demo.toggle())'}
                    </div>
                    <button
                      type="button"
                      onClick={() => loadArduino(true)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card px-4 py-2 text-xs font-semibold text-foreground shadow-[var(--shadow-subtle)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
                      disabled={arduinoLoading}
                    >
                      {arduinoLoading ? (isItalian ? 'Aggiornamento...' : 'Refreshing...') : (isItalian ? 'Aggiorna' : 'Refresh')}
                    </button>
                  </div>

                  {arduinoError && (
                    <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {isItalian ? 'Errore Supabase: ' : 'Supabase error: '}
                      {arduinoError}
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[11px] uppercase text-muted-foreground">
                        <tr className="border-b border-border/60">
                          <th className="py-2 pr-4">{isItalian ? 'Ora' : 'Time'}</th>
                          <th className="py-2 pr-4">{isItalian ? 'Temp (C)' : 'Temp (C)'}</th>
                          <th className="py-2 pr-4">{isItalian ? 'Umidita' : 'Humidity'}</th>
                          <th className="py-2 pr-4">{isItalian ? 'Umidita terreno' : 'Soil humidity'}</th>
                          <th className="py-2 pr-4">{isItalian ? 'AQ' : 'AQ'}</th>
                          <th className="py-2 pr-4">CO2</th>
                          <th className="py-2 pr-4">NH4</th>
                          <th className="py-2 pr-4">{isItalian ? 'Toluene' : 'Toluene'}</th>
                        </tr>
                      </thead>
                      <tbody className="text-foreground">
                        {arduinoRows.length === 0 && !arduinoLoading ? (
                          <tr>
                            <td className="py-4 text-muted-foreground" colSpan={8}>
                              {isItalian ? 'Nessun dato disponibile.' : 'No data available.'}
                            </td>
                          </tr>
                        ) : (
                          arduinoRows.map((row, index) => (
                            <tr key={`${row.created_at}-${index}`} className="border-b border-border/40">
                              <td className="py-2 pr-4">{formatTimestamp(row.created_at)}</td>
                              <td className="py-2 pr-4">{row.temp ?? '—'}</td>
                              <td className="py-2 pr-4">{row.humidity ?? '—'}</td>
                              <td className="py-2 pr-4">{row.soil_moisture ?? '—'}</td>
                              <td className="py-2 pr-4">{row.air_quality ?? '—'}</td>
                              <td className="py-2 pr-4">{row.co2 ?? '—'}</td>
                              <td className="py-2 pr-4">{row.nh4 ?? '—'}</td>
                              <td className="py-2 pr-4">{row.toluene ?? '—'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.section>
            )}

            {showExtraStats && (
              <>
                {/* Seasonal stats */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
                  className="mb-8"
                >
                  <div className="bg-card rounded-3xl p-6 md:p-8 shadow-[var(--shadow-card)] border border-border/30">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
                      <div>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                          {isItalian ? 'Statistiche stagionali meteo' : 'Seasonal weather stats'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {isItalian ? 'Medie e picchi raccolti manualmente dal team.' : 'Averages and peaks collected manually by the team.'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {cities.map((city) => {
                        const stats = SEASONAL_STATS[city.key] || [];
                        return (
                          <div key={city.key} className="rounded-2xl border border-border/60 bg-background/70 p-5">
                            <div className="flex items-center gap-2 mb-4">
                              <MapPin size={14} className="text-primary" weight="fill" />
                              <h3 className="font-serif font-bold text-lg text-foreground">{city.name}</h3>
                            </div>
                            <div className="space-y-3">
                              {stats.map((season) => (
                                <div key={season.season.it} className="flex items-start justify-between gap-4">
                                  <div className="text-sm font-semibold text-foreground">{isItalian ? season.season.it : season.season.en}</div>
                                  <div className="text-right">
                                    <div className="text-sm font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                      {season.min}° / {season.max}°
                                    </div>
                                    {season.note ? (
                                      <div className="text-[11px] text-muted-foreground">{isItalian ? season.note.it : season.note.en}</div>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.section>

                {/* Tourism stats */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, type: 'spring', stiffness: 100 }}
                  className="mb-8"
                >
                  <div className="bg-card rounded-3xl p-6 md:p-8 shadow-[var(--shadow-card)] border border-border/30">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
                      <div>
                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                          {isItalian ? 'Statistiche turismo' : 'Tourism stats'}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {isItalian ? 'Distribuzione annua stimata e percezione dei viaggiatori.' : 'Estimated yearly distribution and traveler sentiment.'}
                        </p>
                      </div>
                    </div>

                <div className="space-y-6">
                  <ManualStatsCharts
                    tourismData={TOURISM_NUMBERS}
                    seasonalStats={SEASONAL_STATS}
                    isItalian={isItalian}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4 italic">
                        {isItalian ? 'Presenze per stagione' : 'Visitors by season'}
                      </h3>
                      <div className="space-y-3">
                        {TOURISM_NUMBERS.map((item) => (
                          <div key={item.season.it} className="flex items-center justify-between gap-4">
                            <div className="text-sm font-semibold text-foreground">{isItalian ? item.season.it : item.season.en}</div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                {item.count.toLocaleString(isItalian ? 'it-IT' : 'en-US')}
                              </div>
                              <div className="text-[11px] text-muted-foreground">{isItalian ? item.share.it : item.share.en}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3 italic">
                        {isItalian ? TOURISM_SENTIMENT.it.title : TOURISM_SENTIMENT.en.title}
                      </h3>
                      <p className="text-sm text-foreground/85 mb-4">
                        {isItalian ? TOURISM_SENTIMENT.it.summary : TOURISM_SENTIMENT.en.summary}
                      </p>
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        {isItalian ? TOURISM_SENTIMENT.it.highlightsTitle : TOURISM_SENTIMENT.en.highlightsTitle}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(isItalian ? TOURISM_SENTIMENT.it.highlights : TOURISM_SENTIMENT.en.highlights).map((item) => (
                          <span key={item} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {item}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        {isItalian ? TOURISM_SENTIMENT.it.cautionsTitle : TOURISM_SENTIMENT.en.cautionsTitle}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(isItalian ? TOURISM_SENTIMENT.it.cautions : TOURISM_SENTIMENT.en.cautions).map((item) => (
                          <span key={item} className="rounded-full bg-muted/60 px-3 py-1 text-xs font-semibold text-foreground/80">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
              </>
            )}

            {/* Weather Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
              className="w-full"
            >
              <div className="bg-card rounded-3xl p-6 shadow-[var(--shadow-card)] border border-border/30">
                <h2 className="font-serif text-2xl font-bold mb-6 text-foreground">{t('meteo.chart.title', 'Andamento meteo')}</h2>
                <WeatherChart />
                <div className="mt-4 text-[11px] text-muted-foreground flex flex-wrap items-center gap-2">
                  <span>Fonte dati meteo:</span>
                  <a
                    href="https://open-meteo.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    Open-Meteo
                  </a>
                  <span className="text-muted-foreground/60">•</span>
                  <span>Qualità aria:</span>
                  <a
                    href="https://open-meteo.com/en/docs/air-quality-api"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    Open-Meteo Air Quality
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58, type: 'spring', stiffness: 120, damping: 20 }}
              className="mt-8"
            >
              <div className="bg-card rounded-3xl p-6 md:p-8 shadow-[var(--shadow-card)] border border-border/30">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                      {isItalian ? 'Andamento Arduino' : 'Arduino trends'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isItalian
                        ? 'Grafico dedicato alle letture Arduino dal database Supabase.'
                        : 'Dedicated chart for Arduino readings from Supabase.'}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <WeatherChart
                    defaultCity="arduino"
                    allowedCities={['arduino']}
                    hideCitySelector
                    compact
                    hideStats
                  />
                </div>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
