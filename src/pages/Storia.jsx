import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import storiaStops from '../data/storiaStops';
import { useI18n } from '../i18n/index.jsx';

export default function Storia() {
  const [activeStop, setActiveStop] = useState(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const { t, tm } = useI18n();
  const stops = tm('storia.cards', storiaStops);

  useEffect(() => {
    if (!activeStop) return;
    setActiveStop(stops.find((stop) => stop.id === activeStop.id) || null);
  }, [activeStop, stops]);

  return (
    <div className="min-h-[100dvh] bg-background relative selection:bg-primary/20">
      
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
        aria-hidden="true"
      />

      <section className="pt-40 pb-20 px-6 max-w-4xl mx-auto text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif font-bold tracking-[-0.03em] mb-8 text-foreground"
        >
          {t('storia.title.lead', 'Un secolo di')} <span className="italic text-primary/70">{t('storia.title.accent', 'storia')}</span> {t('storia.title.tail', 'attraverso gli Appennini')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-muted-foreground leading-relaxed max-w-[60ch] mx-auto"
        >
          {t(
            'storia.subtitle',
            "Progettata a fine Ottocento, la ferrovia Sulmona-Isernia è un capolavoro di ingegneria civile che ha unito le popolazioni montane prima di diventare la linea turistica più iconica d'Italia.",
          )}
        </motion.p>
      </section>

      <section className="py-24 px-6 max-w-6xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stops.map((stop, index) => (
            <motion.button
              key={stop.id}
              type="button"
              onClick={() => setActiveStop(stop)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 120, damping: 18 }}
              className="group cursor-pointer overflow-hidden rounded-3xl border border-border/70 bg-card/70 text-left shadow-[var(--shadow-card)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background"
              aria-label={t('storia.openAria', 'Apri storia di {{title}}', { title: stop.title })}
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={stop.image}
                  alt={stop.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="text-primary font-serif text-xl font-bold italic mb-2">{stop.label}</div>
                <h3 className="text-2xl font-bold tracking-tight text-foreground mb-3">{stop.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{stop.summary}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-primary/90">
                  <span>Leggi la storia</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {activeStop && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
          >
            <button
              type="button"
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setActiveStop(null)}
              aria-label={t('storia.closeOverlay', 'Chiudi finestra')}
            />
            <motion.div
              initial={{ y: 24, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 24, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
              className="relative w-full max-w-4xl bg-card rounded-3xl shadow-[var(--shadow-elevated)] border border-border/70 overflow-hidden"
            >
              <div className="relative h-60 md:h-72 w-full overflow-hidden">
                <img
                  src={activeStop.image}
                  alt={activeStop.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => setActiveStop(null)}
                  className="absolute top-4 right-4 rounded-full bg-background/80 border border-border/70 px-4 py-2 text-sm font-semibold text-foreground hover:bg-background transition"
                >
                  {t('storia.close', 'Chiudi')}
                </button>
              </div>
              <div className="p-8 md:p-10">
                <div className="text-primary font-serif text-2xl font-bold italic mb-3">{activeStop.label}</div>
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
                  {activeStop.title}
                </h3>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  {activeStop.story}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
