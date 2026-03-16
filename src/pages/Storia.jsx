import React, { useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkle, StarFour } from '@phosphor-icons/react';
import StoryExperienceOverlay from '../components/storia/StoryExperienceOverlay';
import storiaStops from '../data/storiaStops';
import { useI18n } from '../i18n/index.jsx';

function mergeStop(base, localized = {}) {
  const baseExperience = base.experience;
  const localizedExperience = localized.experience;

  return {
    ...base,
    ...localized,
    image: localized.image || base.image,
    experience:
      baseExperience || localizedExperience
        ? {
            ...baseExperience,
            ...(localizedExperience || {}),
            stats: localizedExperience?.stats || baseExperience?.stats,
            heroBadges: localizedExperience?.heroBadges || baseExperience?.heroBadges,
            chapters: localizedExperience?.chapters || baseExperience?.chapters,
            gallery: localizedExperience?.gallery || baseExperience?.gallery,
            rituals: localizedExperience?.rituals || baseExperience?.rituals,
            closing: {
              ...baseExperience?.closing,
              ...(localizedExperience?.closing || {}),
            },
          }
        : undefined,
  };
}

function StoryCard({ stop, index, onOpen, t }) {
  const isFeatured = Boolean(stop.experience);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(stop.id)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 120, damping: 18 }}
      className={`group relative overflow-hidden rounded-[32px] border border-border/60 text-left shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background ${
        isFeatured ? 'lg:col-span-2 lg:min-h-[520px]' : 'min-h-[320px]'
      }`}
      aria-label={t('storia.openAria', 'Apri storia di {{title}}', { title: stop.title })}
    >
      <div className="absolute inset-0">
        <img
          src={stop.image}
          alt={stop.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div
          className="absolute inset-0"
          style={{
            background: isFeatured
              ? 'linear-gradient(180deg, rgba(18,15,12,0.16) 0%, rgba(18,15,12,0.34) 38%, rgba(18,15,12,0.9) 100%)'
              : 'linear-gradient(180deg, rgba(18,15,12,0.2) 0%, rgba(18,15,12,0.82) 100%)',
          }}
        />
      </div>

      <div className="relative flex h-full flex-col justify-between p-6 text-white md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/82">
            {stop.label}
          </span>
          {isFeatured ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-[#f5dfb2]/20 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
              <Sparkle size={12} weight="fill" />
              {t('storia.featured', 'Esperienza immersiva')}
            </span>
          ) : null}
        </div>

        <div>
          {isFeatured && stop.experience?.heroBadges?.length ? (
            <div className="mb-5 flex flex-wrap gap-2">
              {stop.experience.heroBadges.slice(0, 3).map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/18 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm"
                >
                  <StarFour size={10} weight="fill" />
                  {badge}
                </span>
              ))}
            </div>
          ) : null}

          <h3 className={`font-serif font-bold tracking-tight ${isFeatured ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>
            {stop.title}
          </h3>
          <p className={`mt-4 max-w-[44ch] leading-relaxed text-white/82 ${isFeatured ? 'text-base md:text-lg' : 'text-sm md:text-base'}`}>
            {stop.summary}
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            <span>{t('storia.enterCta', 'Entra nella città')}</span>
            <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function Storia() {
  const [activeStopId, setActiveStopId] = useState(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const { t, tm } = useI18n();

  const localizedStops = tm('storia.cards', []);
  const stops = storiaStops.map((base) => {
    const localized = localizedStops.find((item) => item.id === base.id);
    return mergeStop(base, localized);
  });

  const activeStop = stops.find((stop) => stop.id === activeStopId) || null;

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-background selection:bg-primary/20">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(circle at 12% 12%, rgba(212, 165, 116, 0.22), transparent 24%), radial-gradient(circle at 82% 10%, rgba(107, 158, 126, 0.18), transparent 20%)',
        }}
      />

      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-primary"
        style={{ scaleX }}
        aria-hidden="true"
      />

      <section className="relative px-6 pb-12 pt-36 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[62rem]"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground shadow-[var(--shadow-subtle)]">
              <Sparkle size={14} weight="fill" className="text-primary" />
              {t('storia.badge', 'Atlante narrativo')}
            </div>

            <h1 className="mt-6 text-5xl font-serif font-bold tracking-[-0.04em] text-foreground md:text-7xl">
              {t('storia.title.lead', 'La storia')}{' '}
              <span className="italic text-primary/80">{t('storia.title.accent', 'si apre')}</span>{' '}
              {t('storia.title.tail', 'città per città')}
            </h1>

            <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t(
                'storia.subtitle',
                "Ogni tappa non si legge soltanto: si apre come un capitolo narrativo, visivo e immersivo della Transiberiana d'Abruzzo. Inizia da Sulmona, poi estenderemo lo stesso linguaggio al resto del percorso.",
              )}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[32px] border border-border/60 bg-card/72 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl md:p-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              {t('storia.panelLabel', 'Direzione creativa')}
            </p>
            <h2 className="mt-4 text-2xl font-serif font-bold tracking-tight text-foreground md:text-3xl">
              {t('storia.panelTitle', 'Click, apertura, immersione')}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t(
                'storia.panelBody',
                'Il redesign sostituisce la classica finestra descrittiva con un’esperienza piena: hero editoriale, capitoli, segnali visivi e ritmo narrativo. Sulmona è il primo prototipo completo.',
              )}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0.92 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="mx-auto mt-12 max-w-7xl"
        >
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-full max-w-32 bg-gradient-to-r from-transparent via-primary/35 to-primary/10" aria-hidden="true" />
            <span className="h-2 w-2 rounded-full bg-primary/45 shadow-[0_0_0_8px_rgba(107,158,126,0.08)]" aria-hidden="true" />
            <span className="h-px w-full max-w-32 bg-gradient-to-l from-transparent via-primary/35 to-primary/10" aria-hidden="true" />
          </div>
        </motion.div>
      </section>

      <section className="relative px-6 pb-24 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stops.map((stop, index) => (
            <StoryCard key={stop.id} stop={stop} index={index} onOpen={setActiveStopId} t={t} />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {activeStop ? (
          <StoryExperienceOverlay stop={activeStop} onClose={() => setActiveStopId(null)} t={t} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
