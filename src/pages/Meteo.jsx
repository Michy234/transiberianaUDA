import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Wind, Thermometer, MapPin, Leaf, CloudSun, Sun, Cloud, Snowflake } from '@phosphor-icons/react';
import { useTheme } from '../components/ThemeContext';
import WeatherChart from '../components/WeatherChart';
import { fetchCurrentConditions, STATIONS } from '../api/openmeteo';
import { useI18n } from '../i18n/index.jsx';

/* ——— States ——— */
const STATES = { LOADING: 'loading', READY: 'ready', ERROR: 'error', EMPTY: 'empty' };

const CITY_PHOTOS = {
  sulmona: '/photos/fermate/sulmona-fermata.webp',
  castel: '/photos/fermate/castel-di-sangro.webp',
  campo: '/photos/fermate/campo-di-giove.webp',
};

function getWeatherIcon(code) {
  if (code <= 0) return <Sun size={48} weight="duotone" className="text-amber-500" />;
  if (code <= 3) return <CloudSun size={48} weight="duotone" className="text-blue-400" />;
  if (code <= 48) return <Cloud size={48} weight="duotone" className="text-slate-400" />;
  if (code <= 67) return <CloudRain size={48} weight="duotone" className="text-blue-500" />;
  return <Snowflake size={48} weight="duotone" className="text-cyan-300" />;
}

function CityWeatherCard({ city, data, delay, t }) {
  const weatherCode = data?.weatherCode ?? 0;
  const photoSrc = CITY_PHOTOS[city.key];
  
  return (
    <motion.a
      href={city.weatherUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100, damping: 20 }}
      className="bg-card p-6 rounded-3xl shadow-[var(--shadow-card)] relative overflow-hidden group hover:shadow-[var(--shadow-card-hover)] hover:scale-[1.02] transition-all duration-300 block"
      role="region"
    >
      {photoSrc && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <img
            src={photoSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px] opacity-30"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/60 to-background/25" />
        </div>
      )}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-primary" weight="fill" />
          <h3 className="font-serif font-bold text-lg text-foreground">{city.name}</h3>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-5xl">
            {getWeatherIcon(weatherCode)}
          </div>
          <div className="text-4xl font-bold tracking-tighter text-foreground" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {data?.temperature ? `${data.temperature.toFixed(1)}°C` : '—'}
          </div>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <CloudRain size={14} /> {data?.humidity ?? '—'}%
          </span>
          <span className="flex items-center gap-1">
            <Wind size={14} /> {data?.pressure ?? '—'} hPa
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {city.altitude}m • {t('meteo.cards.forecastCta', 'Clicca per previsioni complete')}
        </p>
      </div>
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
  const { isDark } = useTheme();
  const { t } = useI18n();

  const cities = [
    { key: 'sulmona', ...STATIONS.sulmona },
    { key: 'castel', ...STATIONS.castel },
    { key: 'campo', ...STATIONS.campo },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCurrentConditions();
        setWeatherData(data);
        setState(STATES.READY);
      } catch (err) {
        setState(STATES.ERROR);
      }
    };

    const loadTimer = setTimeout(() => {
      loadData();
    }, 1000);

    return () => clearTimeout(loadTimer);
  }, []);

  const updateLoop = () => {
    const interval = setInterval(async () => {
      try {
        const data = await fetchCurrentConditions();
        setWeatherData(data);
      } catch (e) {}
    }, 60000);
    return interval;
  };

  useEffect(() => {
    if (state !== STATES.READY) return;
    const interval = updateLoop();
    return () => clearInterval(interval);
  }, [state]);

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
            <ErrorState isDark={isDark} t={t} onRetry={() => { setState(STATES.LOADING); setTimeout(() => setState(STATES.READY), 1500); }} />
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
                />
              ))}
            </div>

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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
