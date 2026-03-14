import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudRain, Wind, Thermometer, MapPin, Leaf, CloudSlash, MoonStars, Campfire } from '@phosphor-icons/react';
import { useTheme } from '../components/ThemeContext';

/* ——— States ——— */
const STATES = { LOADING: 'loading', READY: 'ready', ERROR: 'error', EMPTY: 'empty' };

function LoadingState({ isDark }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-muted-foreground" role="status" aria-label="Caricamento dati meteo">
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
        {isDark ? 'Riscaldando i sensori...' : 'Raccogliendo i dati dai sensori...'}
      </p>
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-primary/30 animate-gentle-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ isDark }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center px-6" role="status">
      <div className="text-5xl mb-2" aria-hidden="true">{isDark ? '🦉' : '🐰'}</div>
      <h3 className="text-xl font-bold text-foreground">Nessun dato disponibile</h3>
      <p className="text-muted-foreground max-w-md leading-relaxed">
        {isDark 
          ? 'I sensori della stazione dormono profondamente. Il gufo meteorologo sta sorvegliando. Riprova tra qualche minuto.'
          : 'I sensori della stazione stanno dormendo. Riprova tra qualche minuto, il coniglietto meteorologo è al lavoro.'
        }
      </p>
    </div>
  );
}

function ErrorState({ isDark, onRetry }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-center px-6" role="alert">
      <div className="relative">
        {isDark ? (
          <span className="text-4xl animate-candle" aria-hidden="true">🕯️</span>
        ) : (
          <Leaf size={48} className="text-destructive/60 animate-leaf-fall" weight="duotone" />
        )}
      </div>
      <h3 className="text-xl font-bold text-foreground">Connessione persa</h3>
      <p className="text-muted-foreground max-w-md leading-relaxed">
        {isDark 
          ? 'La candela si è spenta, non riusciamo a raggiungere i sensori. Controlla la connessione e riprova.'
          : 'Non riusciamo a raggiungere i sensori IoT. Controlla la connessione e riprova.'
        }
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[var(--shadow-button)]"
        >
          Riprova
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
  const [temp, setTemp] = useState('—');
  const [state, setState] = useState(STATES.LOADING);
  const { isDark } = useTheme();
  
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setTemp('8.4');
      setState(STATES.READY);
    }, 1500);
    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (state !== STATES.READY) return;
    const interval = setInterval(() => {
      setTemp((7.8 + Math.random() * 1.4).toFixed(1));
    }, 5000);
    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/8 text-primary text-sm font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-gentle-pulse" aria-hidden="true"></span>
            Sensori IoT attivi
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-[-0.03em] text-foreground mb-2">Meteo live</h1>
          <p className="text-lg text-muted-foreground max-w-[55ch]">Dati rilevati in tempo reale alla stazione di Castel di Sangro.</p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
           className="flex items-center gap-3 px-5 py-3 bg-card rounded-2xl border border-border/50 shadow-[var(--shadow-subtle)]"
        >
          <MapPin size={20} className="text-primary" weight="fill" />
          <span className="font-semibold text-sm">Castel di Sangro (793m)</span>
        </motion.div>
      </div>

      {/* Content with states */}
      <AnimatePresence mode="wait">
        {state === STATES.LOADING && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingState isDark={isDark} />
          </motion.div>
        )}
        
        {state === STATES.ERROR && (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorState isDark={isDark} onRetry={() => { setState(STATES.LOADING); setTimeout(() => setState(STATES.READY), 1500); }} />
          </motion.div>
        )}

        {state === STATES.EMPTY && (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState isDark={isDark} />
          </motion.div>
        )}

        {state === STATES.READY && (
          <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* 2+1 Masonry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MeteoCard 
                delay={0.1} 
                title="Temperatura" 
                value={`${temp}°C`} 
                desc="Aggiornamento ogni 5s"
                icon={<Thermometer size={100} weight="duotone" />} 
              />
              <MeteoCard 
                delay={0.2} 
                title="Umidità" 
                value="72%" 
                desc="Tendenza stabile"
                icon={<CloudRain size={100} weight="duotone" />} 
              />
              <MeteoCard 
                delay={0.3} 
                title="Vento" 
                value="12 km/h" 
                desc="Direzione NE"
                icon={<Wind size={100} weight="duotone" />} 
                className="md:col-span-2"
              />
            </div>

            {/* Forecast Panel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
              className="mt-6 w-full rounded-3xl bg-gradient-to-br from-primary/5 via-background to-primary-light/8 relative overflow-hidden p-10 md:p-12"
            >
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" aria-hidden="true" />
              
              <div className="max-w-lg relative z-10">
                <h2 className="font-serif font-bold text-2xl mb-3 text-foreground">Previsione prossime 24h</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Previsto lieve abbassamento delle temperature nelle ore notturne, con possibilità di precipitazioni nevose oltre i 1.200m. Venti moderati da nord-est.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
