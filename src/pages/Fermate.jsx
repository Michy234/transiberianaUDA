import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Train, Tree, NavigationArrow } from '@phosphor-icons/react';

const stations = [
  { id: 1, name: 'Sulmona', alt: '328m', type: 'Partenza', desc: 'La città dei confetti e di Ovidio. Punto di partenza dell\'itinerario storico.' },
  { id: 2, name: 'Campo di Giove', alt: '1.064m', type: 'Sosta', desc: 'Ai piedi della Majella, incorniciata da fitti boschi e paesaggi mozzafiato.' },
  { id: 3, name: 'Palena', alt: '1.258m', type: 'Punto panoramico', desc: 'Stazione isolata nel Quarto Santa Chiara, regno della natura selvaggia.' },
  { id: 4, name: 'Roccaraso', alt: '1.268m', type: 'Sosta', desc: 'La stazione più alta della linea, rinomata per il turismo montano invernale ed estivo.' },
  { id: 5, name: 'Castel di Sangro', alt: '793m', type: 'Capolinea', desc: 'Città dell\'acqua e della pesca a mosca, nodo cruciale dell\'Alta Valle del Sangro.' }
];

function StationButton({ station, isActive, onClick, index }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 120, damping: 22 }}
      className={`w-full text-left p-5 rounded-2xl transition-all duration-300 relative overflow-hidden flex items-center justify-between group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${isActive 
          ? 'bg-primary/10 shadow-[var(--shadow-card)]' 
          : 'bg-card hover:shadow-[var(--shadow-subtle)] hover:scale-[1.01]'
        }
      `}
      aria-pressed={isActive}
      aria-label={`Stazione di ${station.name}, ${station.type}, altitudine ${station.alt}`}
    >
      <div className="flex items-center gap-4 z-10 relative">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isActive 
            ? 'bg-primary text-primary-foreground shadow-[var(--shadow-subtle)]' 
            : 'bg-secondary text-muted-foreground'
        }`}>
          <MapPin weight={isActive ? "fill" : "regular"} size={20} />
        </div>
        <div>
          <div className={`font-bold text-lg tracking-tight transition-colors ${isActive ? 'text-primary' : 'text-foreground'}`}>
            {station.name}
          </div>
          <div className="text-sm text-muted-foreground mt-0.5 italic">{station.type}</div>
        </div>
      </div>
      
      <div className={`z-10 relative transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'}`}>
        <ArrowRight size={20} weight="bold" className={isActive ? 'text-primary' : 'text-muted-foreground'} />
      </div>
    </motion.button>
  );
}

export default function Fermate() {
  const [selectedStation, setSelectedStation] = useState(stations[0]);

  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-[-0.03em] mb-4 text-foreground">Le fermate</h1>
        <p className="text-lg text-muted-foreground max-w-[65ch] leading-relaxed">
          Esplora le stazioni storiche lungo la ferrovia più alta e panoramica d'Italia, un nastro d'acciaio che cuce parchi nazionali e riserve naturali.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-2" role="listbox" aria-label="Lista delle stazioni">
          <div className="relative">
            {stations.map((station, i) => (
              <div key={station.id} className="relative">
                {i < stations.length - 1 && (
                  <div className="absolute left-[1.85rem] top-[3.5rem] w-0.5 h-[calc(100%-1rem)] bg-border/60 z-0" aria-hidden="true" />
                )}
                <div className="relative z-10 mb-2">
                  <StationButton
                    station={station}
                    isActive={selectedStation.id === station.id}
                    onClick={() => setSelectedStation(station)}
                    index={i}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.article
              key={selectedStation.id}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ type: 'spring', stiffness: 120, damping: 22 }}
              className="h-full bg-card rounded-3xl p-8 md:p-12 shadow-[var(--shadow-elevated)] flex flex-col justify-between"
              aria-live="polite"
              aria-label={`Dettagli stazione: ${selectedStation.name}`}
            >
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/8 text-primary font-semibold text-sm mb-8">
                  <Tree weight="fill" size={16} />
                  Altitudine: {selectedStation.alt}
                </div>
                
                <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-6 text-foreground">
                  {selectedStation.name}
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground max-w-[45ch]">
                  {selectedStation.desc}
                </p>
              </div>

              <div className="mt-12 pt-10 border-t border-border/50 grid grid-cols-2 gap-8">
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-3 italic">Connessioni</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Train className="text-primary" size={18} />
                    </div>
                    <span className="font-semibold">Linea storica</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-3 italic">Esplora</div>
                  <button className="flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg px-1">
                    Vedi disponibilità
                    <NavigationArrow size={16} weight="bold" />
                  </button>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
