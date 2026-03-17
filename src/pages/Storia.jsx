import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, StarFour } from '@phosphor-icons/react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import StoryExperienceOverlay from '../components/storia/StoryExperienceOverlay';
import storiaStops from '../data/storiaStops';
import { useI18n } from '../i18n/index.jsx';
import ImageCredit from '../components/ImageCredit';

gsap.registerPlugin(Flip);

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

function StoryCard({ stop, index, isExpanded, canHoverCards, gridRef, onHoverStart, onHoverEnd, onOpen, t }) {
  const cardClasses = [
    'group relative min-h-[320px] overflow-hidden rounded-[32px] border border-border/60 text-left shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-elevated)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:h-full lg:min-h-0',
    isExpanded ? 'lg:col-span-2' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const titleClasses = [
    'font-serif font-bold tracking-tight transition-all duration-300',
    isExpanded ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl',
  ]
    .filter(Boolean)
    .join(' ');

  const summaryClasses = [
    'mt-4 max-w-[44ch] leading-relaxed text-white/82 transition-all duration-300',
    isExpanded ? 'text-base md:text-lg' : 'text-sm md:text-base',
  ]
    .filter(Boolean)
    .join(' ');

  const heroBadges = stop.experience?.heroBadges?.slice(0, 3) ?? [];

  return (
    <button
      type="button"
      onClick={() => onOpen(stop.id)}
      onMouseEnter={canHoverCards ? () => onHoverStart(stop.id) : undefined}
      onFocus={canHoverCards ? () => onHoverStart(stop.id) : undefined}
      onBlur={
        canHoverCards
          ? (event) => {
              const nextFocusedElement = event.relatedTarget;
              if (!gridRef.current || !nextFocusedElement || !gridRef.current.contains(nextFocusedElement)) {
                onHoverEnd();
              }
            }
          : undefined
      }
      className={cardClasses}
      data-story-card
      aria-label={t('storia.openAria', 'Apri storia di {{title}}', { title: stop.title })}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ delay: index * 0.05, type: 'spring', stiffness: 120, damping: 18 }}
        className="relative h-full"
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
              background: isExpanded
                ? 'linear-gradient(180deg, rgba(18,15,12,0.16) 0%, rgba(18,15,12,0.34) 38%, rgba(18,15,12,0.9) 100%)'
                : 'linear-gradient(180deg, rgba(18,15,12,0.2) 0%, rgba(18,15,12,0.82) 100%)',
            }}
          />
        </div>

        <div className="relative flex h-full flex-col justify-between p-6 text-white md:p-8">
          <div>
            <div
              className={`overflow-hidden transition-[max-height,opacity,margin] duration-300 ${
                isExpanded && heroBadges.length ? 'mb-5 max-h-24 opacity-100' : 'max-h-0 opacity-0'
              }`}
              aria-hidden={!isExpanded}
            >
              <div className="flex flex-wrap gap-2">
                {heroBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-black/18 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm"
                  >
                    <StarFour size={10} weight="fill" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <h3 className={titleClasses}>{stop.title}</h3>
            <p className={summaryClasses}>{stop.summary}</p>

            <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              <span>{t('storia.enterCta', 'Entra nella città')}</span>
              <ArrowRight size={16} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 text-white/80">
          <ImageCredit
            src={stop.image}
            className="text-[10px] text-white/80"
            linkClassName="text-white/90 hover:text-white"
          />
        </div>
      </motion.div>
    </button>
  );
}

export default function Storia() {
  const [activeStopId, setActiveStopId] = useState(null);
  const [hoveredStopId, setHoveredStopId] = useState(null);
  const [canHoverCards, setCanHoverCards] = useState(false);
  const gridRef = useRef(null);
  const flipAnimationRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const { t, tm } = useI18n();

  const localizedStops = tm('storia.cards', []);
  const stops = storiaStops.map((base) => {
    const localized = localizedStops.find((item) => item.id === base.id);
    return mergeStop(base, localized);
  });

  const activeStop = stops.find((stop) => stop.id === activeStopId) || null;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
    const syncHoverCapability = () => setCanHoverCards(mediaQuery.matches);

    syncHoverCapability();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncHoverCapability);
      return () => mediaQuery.removeEventListener('change', syncHoverCapability);
    }

    mediaQuery.addListener(syncHoverCapability);
    return () => mediaQuery.removeListener(syncHoverCapability);
  }, []);

  useEffect(() => {
    if (!canHoverCards && hoveredStopId !== null) {
      setHoveredStopId(null);
    }
  }, [canHoverCards, hoveredStopId]);

  useEffect(
    () => () => {
      flipAnimationRef.current?.kill();
    },
    [],
  );

  const animateHoveredStopChange = (nextStopId) => {
    if (hoveredStopId === nextStopId) {
      return;
    }

    if (!canHoverCards || !gridRef.current) {
      setHoveredStopId(nextStopId);
      return;
    }

    const cards = gridRef.current.querySelectorAll('[data-story-card]');
    if (!cards.length) {
      setHoveredStopId(nextStopId);
      return;
    }

    const state = Flip.getState(cards);
    flipAnimationRef.current?.kill();

    flushSync(() => {
      setHoveredStopId(nextStopId);
    });

    flipAnimationRef.current = Flip.from(state, {
      duration: reduceMotion ? 0 : 0.45,
      ease: 'power2.inOut',
      nested: true,
      prune: true,
      simple: true,
    });
  };

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
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-[62rem] text-center"
          >
            <h1 className="text-5xl font-serif font-bold tracking-[-0.04em] text-foreground md:text-7xl">
              {t('storia.title.lead', 'La storia')}{' '}
              <span className="italic text-primary/80">{t('storia.title.accent', 'si apre')}</span>{' '}
              {t('storia.title.tail', 'città per città')}
            </h1>

            <p className="mx-auto mt-6 max-w-[58ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t(
                'storia.subtitle',
                "Ogni tappa si apre come un capitolo narrativo, visivo e immersivo della Transiberiana d'Abruzzo. Da Sulmona a Isernia, il percorso diventa una sequenza di città, paesaggi, tradizioni e sapori locali.",
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
        <div
          ref={gridRef}
          className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-flow-dense lg:grid-cols-3 lg:auto-rows-[340px]"
          onMouseLeave={canHoverCards ? () => animateHoveredStopChange(null) : undefined}
        >
          {stops.map((stop, index) => (
            <StoryCard
              key={stop.id}
              stop={stop}
              index={index}
              isExpanded={canHoverCards && hoveredStopId === stop.id}
              canHoverCards={canHoverCards}
              gridRef={gridRef}
              onHoverStart={animateHoveredStopChange}
              onHoverEnd={() => animateHoveredStopChange(null)}
              onOpen={setActiveStopId}
              t={t}
            />
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
