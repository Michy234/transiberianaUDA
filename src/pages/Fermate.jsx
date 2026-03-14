import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Train, Tree, NavigationArrow } from '@phosphor-icons/react';

const stations = [
  { id: 1, name: 'Sulmona', alt: '328m', type: 'Partenza', desc: 'La città dei confetti e di Ovidio. Punto di partenza dell\'itinerario storico.' },
  { id: 2, name: 'Campo di Giove', alt: '1.064m', type: 'Sosta', desc: 'Ai piedi della Majella, incorniciata da fitti boschi e paesaggi mozzafiato.' },
  { id: 3, name: 'Palena', alt: '1.258m', type: 'Punto Panoramico', desc: 'Stazione isolata nel Quarto Santa Chiara, regno della natura selvaggia.' },
  { id: 4, name: 'Roccaraso', alt: '1.268m', type: 'Sosta', desc: 'La stazione più alta della linea (dopo Rivisondoli-Pescocostanzo), rinomata per il turismo montano.' },
  { id: 5, name: 'Castel di Sangro', alt: '793m', type: 'Capolinea', desc: 'Città dell\'acqua e della pesca a mosca, nodo cruciale dell\'Alta Valle del Sangro.' }
];

export default function Fermate() {
  const [selectedStation, setSelectedStation] = useState(stations[0]);

  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-foreground">Le Fermate</h1>
        <p className="text-lg text-foreground/60 max-w-[65ch]">Esplora le stazioni storiche lungo la ferrovia più alta e panoramica d'Italia, un nastro d'acciaio che cuce parchi nazionali e riserve naturali.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: List (Intelligent List Archetype) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <AnimatePresence>
            {stations.map((station, i) => {
              const isActive = selectedStation.id === station.id;
              return (
                <motion.button
                  key={station.id}
                  onClick={() => setSelectedStation(station)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 100, damping: 20 }}
                  className={`text-left p-6 rounded-3xl transition-all duration-300 relative overflow-hidden flex items-center justify-between group
                    ${isActive ? 'bg-foreground text-background shadow-xl scale-[1.02]' : 'bg-secondary/50 text-foreground hover:bg-secondary hover:scale-[1.01]'}
                  `}
                >
                  <div className="flex items-center gap-4 z-10 relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-background/20 text-background' : 'bg-background text-foreground shadow-sm'}`}>
                      <MapPin weight={isActive ? "fill" : "regular"} size={24} />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{station.name}</div>
                      <div className={`text-sm mt-0.5 ${isActive ? 'text-background/70' : 'text-foreground/50'}`}>{station.type}</div>
                    </div>
                  </div>
                  
                  <div className={`z-10 relative transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}>
                    <ArrowRight size={24} weight="bold" />
                  </div>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="active-highlight" 
                      className="absolute inset-0 bg-foreground z-0 rounded-3xl"
                      transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right Column: Detailed Contextual UI */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStation.id}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="h-full bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8">
                  <Tree weight="fill" />
                  Altitudine: {selectedStation.alt}
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{selectedStation.name}</h2>
                <p className="text-xl leading-relaxed text-foreground/70 max-w-[45ch]">
                  {selectedStation.desc}
                </p>
              </div>

              <div className="mt-12 pt-12 border-t border-border/50 grid grid-cols-2 gap-8">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Connessioni</div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Train className="text-foreground/70" size={20} />
                    </div>
                    <span className="font-medium">Linea Storica</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Esplora</div>
                  <button className="flex items-center gap-2 text-primary font-medium hover:opacity-80 transition-opacity">
                    Vedi Dispo<span className="hidden sm:inline">nibilità</span>
                    <NavigationArrow size={18} weight="bold" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
