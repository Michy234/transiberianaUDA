import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock, FlowerLotus, ForkKnife, Leaf, MapPin, Snowflake, Sparkle, Sun, Train } from '@phosphor-icons/react';
import { useI18n } from '../i18n/index.jsx';
import ImageCredit from '../components/ImageCredit';
import {
  DEFAULT_ACTIVITY_SEASONS,
  DEFAULT_ACTIVITY_SEASON_COPY,
  DEFAULT_ACTIVITY_STOPS,
} from '../data/activitiesContent.js';

function getInitialSeasonKey() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

function getMotionTransition(reduceMotion, extra = {}) {
  if (reduceMotion) {
    return { duration: 0, ...extra };
  }
  return { type: 'spring', stiffness: 150, damping: 24, ...extra };
}

function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-white/18 bg-black/25 px-4 py-2.5 text-white/92 backdrop-blur-md">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/12 text-white">
        <Icon size={16} weight="duotone" />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/65">{label}</span>
        <span className="block text-sm font-semibold leading-tight">{value}</span>
      </span>
    </div>
  );
}

function StationSelectorButton({ stop, isActive, onClick, t }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className={`group relative min-w-[250px] overflow-hidden rounded-[28px] border text-left shadow-[var(--shadow-card)] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:min-w-0 ${
        isActive
          ? 'border-primary/40 bg-card shadow-[var(--shadow-elevated)]'
          : 'border-border/60 bg-card/80 hover:border-primary/25 hover:shadow-[var(--shadow-card-hover)]'
      }`}
      aria-pressed={isActive}
      aria-label={t('activities.stationAria', 'Apri dettagli di {{name}}', { name: stop.name })}
    >
      <div className="absolute inset-0">
        <img
          src={stop.heroImage}
          alt=""
          className={`h-full w-full object-cover transition-transform duration-500 ${isActive ? 'scale-105' : 'scale-100 group-hover:scale-105'}`}
          loading="lazy"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,20,20,0.10)_0%,rgba(20,20,20,0.78)_100%)]" />
      </div>

      <div className="relative flex h-full min-h-[168px] flex-col justify-between p-5 text-white">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur-sm">
            <MapPin size={12} weight="fill" />
            {stop.type}
          </span>
          <span className={`transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-55 group-hover:translate-x-0 group-hover:opacity-100'}`}>
            <ArrowRight size={16} weight="bold" />
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-serif font-bold tracking-tight">{stop.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/78">{stop.stopDuration}</p>
        </div>
      </div>
    </motion.button>
  );
}

function SeasonSelector({ seasons, selectedSeason, onChange, t }) {
  return (
    <div className="flex flex-wrap gap-3">
      {seasons.map((season) => {
        const isActive = season.key === selectedSeason;
        const Icon = season.icon;
        return (
          <button
            key={season.key}
            type="button"
            onClick={() => onChange(season.key)}
            className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              isActive
                ? 'border-primary/30 bg-primary text-primary-foreground shadow-[var(--shadow-card)]'
                : 'border-border/60 bg-card/75 text-foreground/75 hover:border-primary/20 hover:bg-card hover:text-foreground'
            }`}
            aria-pressed={isActive}
            aria-label={t('activities.seasonAria', 'Seleziona stagione {{season}}', { season: season.label })}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                isActive ? 'bg-primary-foreground/15 text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}
              aria-hidden="true"
            >
              <Icon size={17} weight={isActive ? 'fill' : 'duotone'} />
            </span>
            <span>
              <span className="block text-sm font-semibold leading-tight">{season.label}</span>
              <span className={`block text-[11px] ${isActive ? 'text-primary-foreground/75' : 'text-muted-foreground'}`}>
                {season.range}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PlanTabs({ plans, activePlanId, onChange, t }) {
  return (
    <div className="flex flex-wrap gap-3">
      {plans.map((plan) => {
        const isActive = plan.id === activePlanId;
        return (
          <button
            key={plan.id}
            type="button"
            onClick={() => onChange(plan.id)}
            className={`rounded-2xl border px-4 py-3 text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              isActive
                ? 'border-primary/30 bg-primary/10 text-foreground shadow-[var(--shadow-subtle)]'
                : 'border-border/60 bg-card/70 text-foreground/75 hover:border-primary/20 hover:bg-card hover:text-foreground'
            }`}
            aria-pressed={isActive}
            aria-label={t('activities.planAria', 'Seleziona itinerario {{plan}}', { plan: plan.label })}
          >
            <span className="block text-sm font-semibold">{plan.label}</span>
            <span className="mt-1 block text-xs text-muted-foreground">{plan.duration}</span>
          </button>
        );
      })}
    </div>
  );
}

function SidePanel({ title, eyebrow, children, className = '' }) {
  return (
    <div className={`rounded-[28px] border border-border/60 bg-card/80 p-6 shadow-[var(--shadow-subtle)] ${className}`.trim()}>
      {eyebrow ? (
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">{eyebrow}</div>
      ) : null}
      <h3 className="text-xl font-serif font-bold tracking-tight text-foreground">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function SeasonIconBadge({ seasonKey }) {
  const icons = {
    spring: FlowerLotus,
    summer: Sun,
    autumn: Leaf,
    winter: Snowflake,
  };
  const Icon = icons[seasonKey] || Sparkle;

  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <Icon size={18} weight="duotone" />
    </span>
  );
}

export default function ComeSalire() {
  const reduceMotion = useReducedMotion();
  const { t, tm } = useI18n();
  const [activeStopId, setActiveStopId] = useState(DEFAULT_ACTIVITY_STOPS[0].id);
  const [activeSeason, setActiveSeason] = useState(getInitialSeasonKey());
  const [activePlanId, setActivePlanId] = useState(DEFAULT_ACTIVITY_STOPS[0].plans[0].id);

  const seasons = DEFAULT_ACTIVITY_SEASONS.map((season) => ({
    ...season,
    label: t(`activities.seasons.${season.key}.label`, season.label),
    range: t(`activities.seasons.${season.key}.range`, season.range),
  }));
  const seasonCopy = tm('activities.seasonCopy', DEFAULT_ACTIVITY_SEASON_COPY);
  const stops = tm('activities.stops', DEFAULT_ACTIVITY_STOPS);

  const activeStop = stops.find((stop) => stop.id === activeStopId) || stops[0];
  const activePlan = activeStop?.plans.find((plan) => plan.id === activePlanId) || activeStop?.plans[0];
  const activeSeasonMeta = seasons.find((season) => season.key === activeSeason) || seasons[0];

  useEffect(() => {
    if (!stops.some((stop) => stop.id === activeStopId) && stops[0]) {
      setActiveStopId(stops[0].id);
    }
  }, [activeStopId, stops]);

  useEffect(() => {
    if (!activeStop) return;
    if (!activeStop.plans.some((plan) => plan.id === activePlanId)) {
      setActivePlanId(activeStop.plans[0].id);
    }
  }, [activePlanId, activeStop]);

  if (!activeStop || !activePlan || !activeSeasonMeta) {
    return null;
  }

  const stationListLabel = t('activities.stationListAria', "Seleziona una fermata della Transiberiana d'Abruzzo");
  const detailAria = t('activities.detailAria', 'Dettagli attività per {{name}}', { name: activeStop.name });

  return (
    <div className="min-h-[100dvh] px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getMotionTransition(reduceMotion)}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary/8 px-4 py-2 text-sm font-semibold text-primary"
          >
            <Sparkle weight="fill" size={16} />
            {t('activities.badge', 'Attività consigliate')}
          </motion.div>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getMotionTransition(reduceMotion, { delay: 0.04 })}
            className="mt-6 text-5xl font-serif font-bold tracking-[-0.03em] text-foreground md:text-7xl"
          >
            {t('activities.title', 'Cosa fare durante le fermate')}
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getMotionTransition(reduceMotion, { delay: 0.08 })}
            className="mx-auto mt-6 max-w-[64ch] text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {t(
              'activities.subtitle',
              'Scegli una fermata, cambia stagione e scopri un itinerario credibile per il tempo che hai davvero a disposizione.',
            )}
          </motion.p>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getMotionTransition(reduceMotion, { delay: 0.12 })}
            className="mt-4 text-sm italic text-muted-foreground"
          >
            {t('activities.note', 'Orari e durate sono indicativi: possono variare a seconda della corsa storica.')}
          </motion.p>
        </div>

        <div className="mt-12 lg:hidden">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">
                {t('activities.stationEyebrow', 'Esplora fermata per fermata')}
              </div>
              <h2 className="mt-1 text-2xl font-serif font-bold tracking-tight text-foreground">
                {t('activities.stationSelectorTitle', 'Fermate attive')}
              </h2>
            </div>
            <p className="max-w-[22ch] text-right text-xs leading-relaxed text-muted-foreground">
              {t('activities.stationSelectorHint', 'Seleziona una fermata per cambiare contenuto, immagini e itinerari.')}
            </p>
          </div>

          <div
            role="listbox"
            aria-label={stationListLabel}
            className="flex snap-x gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {stops.map((stop) => (
              <div key={stop.id} className="snap-start">
                <StationSelectorButton
                  stop={stop}
                  isActive={stop.id === activeStop.id}
                  onClick={() => setActiveStopId(stop.id)}
                  t={t}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[320px_minmax(0,1fr)] xl:gap-10">
          <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[32px] border border-border/60 bg-card/80 p-5 shadow-[var(--shadow-card)]">
              <div className="mb-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">
                  {t('activities.stationEyebrow', 'Esplora fermata per fermata')}
                </div>
                <h2 className="mt-2 text-3xl font-serif font-bold tracking-tight text-foreground">
                  {t('activities.stationSelectorTitle', 'Fermate attive')}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t('activities.stationSelectorHint', 'Seleziona una fermata per cambiare contenuto, immagini e itinerari.')}
                </p>
              </div>

              <div role="listbox" aria-label={stationListLabel} className="flex flex-col gap-3">
                {stops.map((stop) => (
                  <StationSelectorButton
                    key={stop.id}
                    stop={stop}
                    isActive={stop.id === activeStop.id}
                    onClick={() => setActiveStopId(stop.id)}
                    t={t}
                  />
                ))}
              </div>
            </div>
          </aside>

          <div>
            <AnimatePresence mode="wait">
              <motion.article
                key={activeStop.id}
                initial={reduceMotion ? false : { opacity: 0, y: 22, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -18, filter: 'blur(8px)' }}
                transition={getMotionTransition(reduceMotion)}
                className="overflow-hidden rounded-[36px] border border-border/60 bg-card shadow-[var(--shadow-elevated)]"
                aria-live="polite"
                aria-label={detailAria}
              >
                <div className="relative overflow-hidden">
                  <div className="relative h-[340px] md:h-[420px]">
                    <img
                      src={activeStop.heroImage}
                      alt={activeStop.heroAlt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,18,15,0.06)_0%,rgba(19,18,15,0.22)_30%,rgba(19,18,15,0.88)_100%)]" />
                    <div className="absolute inset-x-0 top-0 p-6 md:p-8">
                      <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/90 backdrop-blur-md">
                          <MapPin size={13} weight="fill" />
                          {activeStop.type}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/90 backdrop-blur-md">
                          <SeasonIconBadge seasonKey={activeSeason} />
                          <span className="-ml-1">{activeSeasonMeta.label}</span>
                        </span>
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      <div className="max-w-4xl">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/68">
                          {t('activities.currentStop', 'Fermata selezionata')}
                        </div>
                        <h2 className="mt-3 text-4xl font-serif font-bold tracking-tight text-white md:text-5xl">
                          {activeStop.name}
                        </h2>
                        <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-white/82 md:text-lg">
                          {activeStop.desc}
                        </p>
                        <p className="mt-3 max-w-[58ch] text-sm italic text-white/72">{activeStop.timeHint}</p>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <InfoPill icon={Train} label={t('activities.altitude', 'Altitudine')} value={activeStop.alt} />
                          <InfoPill icon={Clock} label={t('activities.typicalStop', 'Sosta tipica')} value={activeStop.stopDuration} />
                          <InfoPill
                            icon={MapPin}
                            label={t('activities.scheduleTitle', 'Orari indicativi')}
                            value={activeStop.schedule.duration}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 right-4">
                      <ImageCredit
                        src={activeStop.heroImage}
                        className="rounded-full bg-black/35 px-3 py-1.5 text-[10px] text-white/90 backdrop-blur-sm"
                        linkClassName="text-white/90 hover:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 lg:p-10">
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_340px]">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">
                        {t('activities.seasonContextLabel', 'Atmosfera della stagione')}
                      </div>
                      <div className="mt-4">
                        <SeasonSelector
                          seasons={seasons}
                          selectedSeason={activeSeason}
                          onChange={setActiveSeason}
                          t={t}
                        />
                      </div>

                      <motion.div
                        key={`${activeStop.id}-${activeSeason}-context`}
                        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={getMotionTransition(reduceMotion)}
                        className="mt-5 rounded-[28px] border border-border/60 bg-secondary/55 p-5 shadow-[var(--shadow-subtle)]"
                      >
                        <div className="flex items-start gap-4">
                          <SeasonIconBadge seasonKey={activeSeason} />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground">{activeSeasonMeta.label}</div>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {activeStop.seasonContext[activeSeason]}
                            </p>
                            <p className="mt-3 text-xs text-muted-foreground">
                              {seasonCopy[activeSeason]}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <div className="mt-8">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">
                          {t('activities.itineraryTitle', 'Itinerario attivo')}
                        </div>
                        <div className="mt-4">
                          <PlanTabs
                            plans={activeStop.plans}
                            activePlanId={activePlan.id}
                            onChange={setActivePlanId}
                            t={t}
                          />
                        </div>

                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${activePlan.id}-${activeSeason}`}
                            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                            transition={getMotionTransition(reduceMotion)}
                            className="mt-5 rounded-[32px] border border-border/60 bg-card/90 p-6 shadow-[var(--shadow-card)]"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div className="max-w-[60ch]">
                                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">
                                  {t('activities.activeItineraryLabel', 'Percorso consigliato')}
                                </div>
                                <h3 className="mt-2 text-2xl font-serif font-bold tracking-tight text-foreground">
                                  {activePlan.label}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                  {activePlan.summary}
                                </p>
                              </div>

                              <div className="rounded-2xl border border-border/60 bg-secondary/55 px-4 py-3 text-sm font-semibold text-foreground">
                                {activePlan.duration}
                              </div>
                            </div>

                            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                              <div>
                                <div className="rounded-[26px] border border-border/60 bg-secondary/45 p-5">
                                  <div className="text-sm font-semibold text-foreground">
                                    {t('activities.bestForLabel', 'Ideale per')}
                                  </div>
                                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{activePlan.bestFor}</p>
                                </div>

                                <ul className="mt-4 flex flex-col gap-3">
                                  {activePlan.activities[activeSeason].map((item, index) => (
                                    <li key={`${activePlan.id}-${activeSeason}-${index}`} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/80" aria-hidden="true" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="space-y-4">
                                <div className="rounded-[26px] border border-border/60 bg-secondary/45 p-5">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Train size={16} weight="duotone" className="text-primary" />
                                    {t('activities.logisticsLabel', 'Come si muove la sosta')}
                                  </div>
                                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{activePlan.logistics}</p>
                                </div>

                                <div className="rounded-[26px] border border-border/60 bg-secondary/45 p-5">
                                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <ForkKnife size={16} weight="duotone" className="text-primary" />
                                    {t('activities.mealTipLabel', 'Pausa gusto')}
                                  </div>
                                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{activePlan.mealTip}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>

                    <SidePanel title={t('activities.scheduleTitle', 'Orari indicativi')} eyebrow={t('activities.scheduleEyebrow', 'Finestra della fermata')}>
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-border/60 bg-secondary/45 px-4 py-4">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">
                            {t('activities.arrivalLabel', 'Arrivo')}
                          </div>
                          <div className="mt-2 text-base font-semibold text-foreground">{activeStop.schedule.arrival}</div>
                        </div>

                        <div className="rounded-2xl border border-border/60 bg-secondary/45 px-4 py-4">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">
                            {t('activities.departureLabel', 'Ripartenza')}
                          </div>
                          <div className="mt-2 text-base font-semibold text-foreground">{activeStop.schedule.departure}</div>
                        </div>

                        <div className="rounded-2xl border border-border/60 bg-secondary/45 px-4 py-4">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">
                            {t('activities.durationLabel', 'Tempo utile')}
                          </div>
                          <div className="mt-2 text-base font-semibold text-foreground">{activeStop.schedule.duration}</div>
                        </div>

                        <div className="rounded-[24px] border border-border/60 bg-card/80 px-4 py-4">
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Sparkle size={16} weight="duotone" className="text-primary" />
                            {t('activities.scheduleNoteLabel', 'Nota')}
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{activeStop.schedule.note}</p>
                        </div>
                      </div>
                    </SidePanel>
                  </div>

                  <div className="mt-6 grid gap-5 lg:grid-cols-3">
                    <SidePanel title={t('activities.highlightsTitle', 'Da non perdere')} eyebrow={t('activities.highlightsEyebrow', 'Punti fermi')}>
                      <ul className="space-y-3">
                        {activeStop.highlights.map((item, index) => (
                          <li key={`${activeStop.id}-highlight-${index}`} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/80" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </SidePanel>

                    <SidePanel title={t('activities.practicalTitle', 'Nota pratica')} eyebrow={t('activities.practicalEyebrow', 'Prima di muoverti')}>
                      <p className="text-sm leading-relaxed text-muted-foreground">{activeStop.practicalNote}</p>
                      <div className="mt-4 rounded-[24px] border border-border/60 bg-secondary/45 p-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <ForkKnife size={16} weight="duotone" className="text-primary" />
                          {t('activities.mealTipLabel', 'Pausa gusto')}
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{activePlan.mealTip}</p>
                      </div>
                    </SidePanel>

                    <SidePanel title={t('activities.stopFlowTitle', 'Come funziona la sosta')} eyebrow={t('activities.stopFlowEyebrow', 'Ritmo consigliato')}>
                      <ul className="space-y-3">
                        {activeStop.howItWorks.map((item, index) => (
                          <li key={`${activeStop.id}-flow-${index}`} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                              {index + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </SidePanel>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
