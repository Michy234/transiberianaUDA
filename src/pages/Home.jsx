import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CloudRain, MapPin, Tree, Mountains } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full relative overflow-hidden bg-background">
      {/* Asymmetric Hero */}
      <section className="min-h-[100dvh] w-full flex flex-col lg:flex-row relative">
        
        {/* Left Content (55%) */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-32 pb-16 z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.2 }}
            className="max-w-xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/8 text-primary text-sm font-semibold tracking-tight mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-gentle-pulse" aria-hidden="true"></span>
              Prossima partenza: Sulmona
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-[-0.03em] leading-[1.08] text-foreground mb-8">
              Il viaggio nel <br />
              <span className="text-primary italic">cuore verde</span> <br />
              d'Italia
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[50ch] mb-10">
              Un'esperienza autentica a bordo di carrozze d'epoca. Attraversa i Parchi Nazionali e i borghi più belli dell'Appennino Centrale.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link 
                to="/storia" 
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_8px_24px_rgba(107,158,126,0.3)]"
              >
                Inizia il viaggio
                <ArrowRight weight="bold" size={18} />
              </Link>
              <Link 
                to="/fermate" 
                className="px-8 py-4 bg-card text-foreground rounded-2xl font-semibold flex items-center justify-center hover:shadow-[0_8px_20px_rgba(107,158,126,0.12)] transition-all duration-300 border border-border/60"
              >
                Scopri l'itinerario
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Image (45%) with overlap */}
        <div className="w-full lg:w-[45%] min-h-[50vh] lg:min-h-0 relative p-4 md:p-6 lg:p-8 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="w-full h-full relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(107,158,126,0.15)] lg:-ml-12"
          >
            <img 
              src="/photos/storia/transiberiana.jpg" 
              alt="Treno storico che attraversa un viadotto immerso nella vegetazione delle montagne abruzzesi" 
              className="object-cover w-full h-full"
              loading="eager"
            />
            
            {/* Warm Floating Stats Card */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 100, damping: 20 }}
              className="absolute bottom-6 left-6 right-6 z-20 bg-card/90 backdrop-blur-lg p-5 rounded-2xl shadow-[0_12px_32px_rgba(45,74,56,0.12)] border border-border/40"
            >
              <div className="grid grid-cols-3 gap-4 text-foreground">
                <div>
                  <div className="text-muted-foreground text-xs font-semibold mb-1" style={{ fontVariant: 'small-caps' }}>Altitudine max</div>
                  <div className="text-xl font-bold flex items-center gap-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <Tree weight="fill" className="text-primary" size={18} />
                    1.268m
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-semibold mb-1" style={{ fontVariant: 'small-caps' }}>Meteo live</div>
                  <div className="text-xl font-bold flex items-center gap-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <CloudRain weight="fill" className="text-[#B0D8E8]" size={18} />
                    8°C
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-semibold mb-1" style={{ fontVariant: 'small-caps' }}>Fermate</div>
                  <div className="text-xl font-bold flex items-center gap-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <MapPin weight="fill" className="text-[#D4A574]" size={18} />
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
