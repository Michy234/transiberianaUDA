import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Wind, Thermometer, MapPin } from '@phosphor-icons/react';

function MeteoCard({ delay, title, value, icon, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100, damping: 20 }}
      className="bg-card border border-border p-8 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)] relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 text-foreground/5 opacity-50 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="relative z-10">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-2">{title}</h3>
        <div className="text-5xl font-mono tracking-tighter font-bold mb-4">{value}</div>
        <p className="text-sm text-foreground/60">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function Meteo() {
  const [temp, setTemp] = useState('—');
  
  // Fake simulated live data updating
  useEffect(() => {
    setTemp('8.4');
    const interval = setInterval(() => {
      setTemp((8 + Math.random()).toFixed(1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Sensori IoT Attivi
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground mb-2">Meteo Live</h1>
          <p className="text-lg text-foreground/60">Dati rilevati in tempo reale alla stazione di Castel di Sangro.</p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
           className="flex items-center gap-3 px-6 py-4 bg-secondary rounded-full"
        >
          <MapPin size={24} className="text-muted-foreground" />
          <span className="font-semibold">Castel di Sangro (793m)</span>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MeteoCard 
          delay={0.1} 
          title="Temperatura" 
          value={`${temp}°C`} 
          desc="Aggiornamento ogni 5s"
          icon={<Thermometer size={120} weight="duotone" />} 
        />
        <MeteoCard 
          delay={0.2} 
          title="Umidità" 
          value="72%" 
          desc="Tendenza stabile"
          icon={<CloudRain size={120} weight="duotone" />} 
        />
        <MeteoCard 
          delay={0.3} 
          title="Vento" 
          value="12 km/h" 
          desc="Direzione NE"
          icon={<Wind size={120} weight="duotone" />} 
        />
      </div>

      {/* Decorative Chart Area / Glass panel bento */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
        className="mt-6 w-full h-[400px] rounded-[2.5rem] bg-gradient-to-br from-secondary/50 to-secondary/10 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center p-12 text-center"
      >
         <div className="absolute inset-0 max-w-full overflow-hidden flex items-end opacity-20 dark:opacity-10 pointer-events-none">
             {/* Abstract wave representing chart */}
             <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-[80%] fill-foreground">
               <path d="M0,300 L0,150 C100,120 200,200 300,180 C400,160 500,80 600,100 C700,120 800,250 900,220 C950,205 1000,100 1000,100 L1000,300 Z" />
             </svg>
         </div>
         
         <div className="max-w-md relative z-10 backdrop-blur-md bg-background/50 rounded-2xl p-6 border border-border/50">
            <h4 className="font-bold text-lg mb-2">Previsione Prossime 24h</h4>
            <p className="text-foreground/70 text-sm">Previsto lieve abbassamento delle temperature nelle ore notturne, con possibilità di precipitazioni nevose oltre i 1.200m.</p>
         </div>
      </motion.div>

    </div>
  );
}
