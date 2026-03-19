import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Buildings,
  MapPin,
  Mountains,
  Scroll,
  Sparkle,
  StarFour,
  X,
} from '@phosphor-icons/react';
import ImageCredit from '../ImageCredit';
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility';

const CHAPTER_ICONS = [Scroll, Buildings, Sparkle, StarFour, Mountains];
const CHAPTER_ACCENTS = [
  'rgba(212, 165, 116, 0.24)',
  'rgba(107, 158, 126, 0.2)',
  'rgba(242, 196, 196, 0.22)',
  'rgba(212, 165, 116, 0.18)',
  'rgba(107, 158, 126, 0.16)',
];

const STORY_OVERLAY_INERT_SELECTORS = ['nav', 'footer'];

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ChapterSection({ chapter, index, stopId, t }) {
  const Icon = CHAPTER_ICONS[index % CHAPTER_ICONS.length];
  const accent = CHAPTER_ACCENTS[index % CHAPTER_ACCENTS.length];
  const anchorId = `story-${stopId}-${chapter.id}`;

  return (
    <motion.section
      id={anchorId}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.06, duration: 0.45, ease: 'easeOut' }}
      className="grid gap-6 rounded-[32px] border border-border/60 bg-card/70 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl lg:grid-cols-[140px_minmax(0,1fr)] lg:p-8"
    >
      <div className="flex items-start gap-4 lg:flex-col lg:gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent-warm/25 text-foreground">
          <Icon size={24} weight="duotone" />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            0{index + 1}
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground/80">{chapter.title}</p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h3 className="text-2xl font-serif font-bold tracking-tight text-foreground md:text-3xl">
            {chapter.title}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            {chapter.body}
          </p>
        </div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="group relative overflow-hidden rounded-[28px] border border-border/50 bg-background/75 p-5"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-90"
            style={{
              background: `radial-gradient(circle at top right, ${accent}, transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.12), transparent 72%)`,
            }}
          />
          <div className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-border/50 bg-card/78 text-primary shadow-[var(--shadow-subtle)] transition-transform duration-300 group-hover:scale-105">
            <Icon size={16} weight="duotone" />
          </div>

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {t('storia.overlay.focus', 'Snodi')}
            </p>
            <p className="mt-3 max-w-[24ch] text-base leading-relaxed text-foreground">{chapter.pullout}</p>

            <div className="mt-6 flex items-center gap-3 text-primary/65" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-primary/55 shadow-[0_0_0_4px_rgba(107,158,126,0.08)]" />
              <span className="h-px flex-1 bg-gradient-to-r from-primary/35 via-primary/15 to-transparent" />
              <span className="h-1.5 w-1.5 rounded-full bg-accent-warm/70" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function ImmersiveExperience({ stop, t }) {
  const { experience } = stop;
  const gallery = experience.gallery?.length
    ? experience.gallery
    : [{ id: 'fallback', src: stop.image, alt: stop.title, caption: stop.summary }];
  const detailGallery = experience.detailGallery?.length ? experience.detailGallery : gallery;

  return (
    <section className="px-6 pb-24 pt-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[36px] border border-border/60 bg-card/70 p-8 shadow-[var(--shadow-elevated)] backdrop-blur-xl md:p-10"
          >
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background:
                  'radial-gradient(circle at top left, rgba(212, 165, 116, 0.3), transparent 42%), radial-gradient(circle at bottom right, rgba(107, 158, 126, 0.22), transparent 38%)',
              }}
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/75 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                <Sparkle size={14} weight="fill" className="text-primary" />
                {experience.eyebrow}
              </div>

              <h2 className="mt-6 max-w-[12ch] text-5xl font-serif font-bold leading-none tracking-[-0.04em] text-foreground md:text-7xl">
                {stop.title}
              </h2>

              <p className="mt-5 max-w-[44ch] text-lg leading-relaxed text-foreground/85 md:text-xl">
                {experience.intro}
              </p>

              <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-muted-foreground md:text-lg">
                {experience.body}
              </p>

              <div className="mt-8 rounded-[28px] border border-border/60 bg-background/72 p-5">
                <p className="text-lg font-serif italic tracking-tight text-foreground md:text-xl">
                  “{experience.quote}”
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {experience.heroBadges?.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-4 py-2 text-sm font-semibold text-foreground/85"
                  >
                    <MapPin size={14} weight="fill" className="text-primary" />
                    {badge}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollToSection(`story-${stop.id}-${experience.chapters?.[0]?.id ?? 'radici'}`)}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-button)] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('storia.overlay.startJourney', 'Inizia il capitolo')}
                <ArrowRight size={16} weight="bold" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
            className="grid content-start self-start gap-4 md:grid-cols-2"
          >
            <figure className="relative self-start overflow-hidden rounded-[32px] border border-border/60 bg-card/70 shadow-[var(--shadow-card)] md:col-span-2">
              <img
                src={gallery[0].src}
                alt={gallery[0].alt}
                className="h-[360px] w-full object-cover md:h-[420px]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120f0c]/80 via-[#120f0c]/10 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-sm font-medium text-white/88 md:text-base">
                <div>{gallery[0].caption}</div>
                <ImageCredit
                  src={gallery[0].src}
                  className="mt-2 text-[10px] text-white/80"
                  linkClassName="text-white/90 hover:text-white"
                />
              </figcaption>
            </figure>

            {gallery.slice(1, 3).map((item, index) => (
              <figure
                key={item.id}
                className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card/70 shadow-[var(--shadow-card)]"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-[250px] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120f0c]/72 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-sm font-medium text-white/88">
                  <div>{item.caption}</div>
                  <ImageCredit
                    src={item.src}
                    className="mt-2 text-[10px] text-white/80"
                    linkClassName="text-white/90 hover:text-white"
                  />
                </figcaption>
                <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground">
                  {index === 0 ? <Buildings size={16} weight="duotone" /> : <Sparkle size={16} weight="fill" />}
                </div>
              </figure>
            ))}
          </motion.div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {experience.stats?.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="rounded-[28px] border border-border/60 bg-card/70 p-5 shadow-[var(--shadow-subtle)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-2 text-lg font-bold tracking-tight text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-10">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[28px] border border-border/60 bg-card/70 p-5 shadow-[var(--shadow-card)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                {t('storia.overlay.chapters', 'Capitoli')}
              </p>

              <div className="mt-4 flex flex-col gap-2">
                {experience.chapters?.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => scrollToSection(`story-${stop.id}-${chapter.id}`)}
                    className="flex items-center justify-between rounded-2xl border border-transparent bg-background/65 px-4 py-3 text-left transition-all duration-200 hover:border-border/70 hover:bg-background"
                  >
                    <span>
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        0{index + 1}
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-foreground">{chapter.title}</span>
                    </span>
                    <ArrowRight size={14} weight="bold" className="text-primary" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-border/60 bg-card/70 p-5 shadow-[var(--shadow-card)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                {t('storia.overlay.cityPulse', 'Segni vivi')}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {experience.rituals?.map((item) => (
                  <span
                    key={item.title}
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/72 px-3 py-2 text-xs font-semibold text-foreground/85"
                  >
                    <StarFour size={10} weight="fill" className="text-primary" />
                    {item.title}
                  </span>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            {experience.chapters?.map((chapter, index) => (
              <ChapterSection key={chapter.id} chapter={chapter} index={index} stopId={stop.id} t={t} />
            ))}

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="rounded-[32px] border border-border/60 bg-card/70 p-6 shadow-[var(--shadow-card)] md:p-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Buildings size={22} weight="duotone" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    {t('storia.overlay.gallery', 'Scene da valorizzare')}
                  </p>
                  <h3 className="text-2xl font-serif font-bold tracking-tight text-foreground">
                    {t('storia.overlay.galleryTitle', 'Materia visiva di {{city}}', { city: stop.title })}
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {detailGallery.map((item) => (
                  <figure key={item.id} className="overflow-hidden rounded-[28px] border border-border/60 bg-background/70">
                    <div className="relative">
                      <img src={item.src} alt={item.alt} className="h-56 w-full object-cover" loading="lazy" />
                      <ImageCredit
                        src={item.src}
                        className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1 text-[10px] text-white/90"
                        linkClassName="text-white/90 hover:text-white"
                      />
                    </div>
                    <figcaption className="p-4 text-sm leading-relaxed text-muted-foreground">{item.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
              className="rounded-[32px] border border-border/60 bg-card/70 p-6 shadow-[var(--shadow-card)] md:p-8"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-warm/25 text-foreground">
                  <Sparkle size={22} weight="fill" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    {t('storia.overlay.rituals', 'Riti e segni identitari')}
                  </p>
                  <h3 className="text-2xl font-serif font-bold tracking-tight text-foreground">
                    {t('storia.overlay.ritualsTitle', 'Quello che la città rimette in scena')}
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-3">
                {experience.rituals?.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[28px] border border-border/60 bg-background/72 p-5"
                  >
                    <div className="inline-flex rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                      {item.tag}
                    </div>
                    <h4 className="mt-4 text-xl font-bold tracking-tight text-foreground">{item.title}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                  </article>
                ))}
              </div>
            </motion.section>

          </div>
        </div>
      </div>
    </section>
  );
}

function FallbackExperience({ stop, t }) {
  return (
    <section className="px-6 pb-24 pt-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 xl:grid-cols-[0.98fr_1.02fr]">
          <figure className="relative overflow-hidden rounded-[36px] border border-border/60 bg-card/70 shadow-[var(--shadow-card)]">
            <img src={stop.image} alt={stop.title} className="h-[420px] w-full object-cover md:h-[520px]" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120f0c]/78 via-[#120f0c]/12 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 text-base font-medium text-white/88">
              <div>{stop.summary}</div>
              <ImageCredit
                src={stop.image}
                className="mt-2 text-[10px] text-white/80"
                linkClassName="text-white/90 hover:text-white"
              />
            </figcaption>
          </figure>

          <div className="rounded-[36px] border border-border/60 bg-card/70 p-8 shadow-[var(--shadow-card)] backdrop-blur-xl md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/72 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              <Scroll size={14} weight="duotone" className="text-primary" />
              {t('storia.overlay.preview', 'Scheda narrativa')}
            </div>

            <h2 className="mt-6 text-4xl font-serif font-bold tracking-tight text-foreground md:text-5xl">
              {stop.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-foreground/85">{stop.summary}</p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{stop.story}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-border/60 bg-background/72 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {t('storia.overlay.previewStatus', 'Formato')}
                </p>
                <p className="mt-2 text-lg font-bold tracking-tight text-foreground">
                  {t('storia.overlay.previewStatusValue', 'Scheda compatta')}
                </p>
              </div>
              <div className="rounded-[28px] border border-border/60 bg-background/72 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {t('storia.overlay.previewFocus', 'Lettura')}
                </p>
                <p className="mt-2 text-lg font-bold tracking-tight text-foreground">
                  {t('storia.overlay.previewFocusValue', 'Sintesi visiva e testuale')}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-dashed border-border/70 bg-accent-warm/12 p-5 text-sm leading-relaxed text-foreground/80">
              {t(
                'storia.overlay.placeholderNote',
                'Per ora questa città si apre in formato compatto, con una sintesi narrativa pensata per accompagnare il viaggio.',
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function StoryExperienceOverlay({ stop, onClose, t }) {
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);

  useDialogAccessibility({
    isOpen: Boolean(stop),
    containerRef: overlayRef,
    initialFocusRef: closeButtonRef,
    onClose,
    inertSelectors: STORY_OVERLAY_INERT_SELECTORS,
  });

  if (!stop) return null;

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-background/96 backdrop-blur-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
      aria-label={t('storia.overlay.dialogAria', 'Esperienza della città')}
    >
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(212, 165, 116, 0.2), transparent 28%), radial-gradient(circle at top right, rgba(107, 158, 126, 0.14), transparent 22%)',
        }}
      />

      <div className="relative h-full overflow-y-auto">
        <div className="sticky top-0 z-40 border-b border-border/60 bg-background/82 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 md:px-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/72 px-4 py-2 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-card"
              >
                <ArrowLeft size={16} weight="bold" />
                {t('storia.overlay.back', 'Torna alle città')}
              </button>

              <div className="hidden sm:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {stop.experience ? t('storia.overlay.mode', 'Esperienza immersiva') : t('storia.overlay.preview', 'Scheda narrativa')}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground/80">{stop.label}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {t('storia.overlay.city', 'Città')}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">{stop.title}</p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card/72 text-foreground transition-colors duration-200 hover:bg-card"
                aria-label={t('storia.closeOverlay', 'Chiudi finestra')}
              >
                <X size={18} weight="bold" />
              </button>
            </div>
          </div>
        </div>

        {stop.experience ? <ImmersiveExperience stop={stop} t={t} /> : <FallbackExperience stop={stop} t={t} />}
      </div>
    </motion.div>
  );
}
