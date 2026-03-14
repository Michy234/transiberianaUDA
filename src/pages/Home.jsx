import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CloudRain, MapPin, Tree } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full relative overflow-hidden bg-background">
      {/* Asymmetric Split Screen Hero */}
      <section className="min-h-[100dvh] w-full flex flex-col md:flex-row relative">
        {/* Left Content Area */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-16 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-sm font-medium text-foreground tracking-tight mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Prossima Partenza: Sulmona
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] text-foreground mb-6">
              Il Viaggio nel <br />
              <span className="text-primary italic">Cuore Verde</span> <br />
              d'Italia
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/60 leading-relaxed max-w-[50ch] mb-10">
              Un'esperienza autentica a bordo di carrozze d'epoca. Attraversa i Parchi Nazionali e i borghi più belli dell'Appennino Centrale.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                to="/storia" 
                className="w-full sm:w-auto px-8 py-4 bg-foreground text-background rounded-full font-medium flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform"
              >
                Inizia il Viaggio
                <ArrowRight weight="bold" />
              </Link>
              <Link 
                to="/fermate" 
                className="w-full sm:w-auto px-8 py-4 bg-secondary text-foreground rounded-full font-medium flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                Scopri l'Itinerario
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Asset Area (Desktop Parallax/Blur Image) */}
        <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen relative p-4 md:p-8 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative rounded-[2.5rem] overflow-hidden"
          >
            <div className="absolute inset-0 bg-foreground/10 z-10 mix-blend-overlay"></div>
            <img 
              src="https://images.unsplash.com/photo-1542157585-ef20bfcce579?q=80&w=2600&auto=format&fit=crop" 
              alt="Treno che attraversa la natura in montagna" 
              className="object-cover w-full h-full scale-105"
            />
            
            {/* Glassmorphic Floating Bento Meta-badge */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 100, damping: 20 }}
              className="absolute bottom-8 left-8 right-8 z-20 backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-[-1]"></div>
              <div className="grid grid-cols-3 gap-4 text-white">
                <div>
                  <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">Altitudine max</div>
                  <div className="text-2xl font-mono font-medium flex items-center gap-2">
                    <Tree weight="fill" className="text-emerald-400" />
                    1.268m
                  </div>
                </div>
                <div>
                  <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">Meteo Live</div>
                  <div className="text-2xl font-mono font-medium flex items-center gap-2">
                    <CloudRain weight="fill" className="text-blue-300" />
                    8°C
                  </div>
                </div>
                <div>
                   <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">Fermate</div>
                  <div className="text-2xl font-mono font-medium flex items-center gap-2">
                     <MapPin weight="fill" className="text-rose-400" />
                     21
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
