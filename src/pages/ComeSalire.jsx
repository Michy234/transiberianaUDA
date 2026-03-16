import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sun, Snowflake, Leaf, FlowerLotus, Clock, ForkKnife, Train, Sparkle } from '@phosphor-icons/react';
import { useI18n } from '../i18n/index.jsx';

const DEFAULT_SEASONS = [
  { key: 'spring', label: 'Primavera', range: 'Mar-Mag', icon: FlowerLotus },
  { key: 'summer', label: 'Estate', range: 'Giu-Ago', icon: Sun },
  { key: 'autumn', label: 'Autunno', range: 'Set-Nov', icon: Leaf },
  { key: 'winter', label: 'Inverno', range: 'Dic-Feb', icon: Snowflake },
];

const DEFAULT_SEASON_COPY = {
  spring: 'Fioriture e aria fresca: passeggiate morbide e ritmi lenti.',
  summer: 'Giornate lunghe: cerca ombra, acqua fresca e panorami aperti.',
  autumn: 'Colori caldi e sapori di stagione: perfetti per un ritmo tranquillo.',
  winter: 'Atmosfera montana: attività brevi e soste al caldo.',
};

// Durate indicative: aggiornale qui quando disponibili.
const DEFAULT_STOPS = [
  {
    id: 1,
    name: 'Sulmona',
    alt: '328m',
    type: 'Partenza',
    stopDuration: '60-120 min',
    timeHint: 'Ideale prima della partenza o al rientro',
    desc: "La città dei confetti e di Ovidio. Punto di partenza dell'itinerario storico.",
    plans: [
      {
        id: 'sulmona-breve',
        label: 'Sosta breve',
        duration: '60-90 min',
        mealTip: 'Se sei in fascia pranzo, scegli una trattoria nel centro.',
        activities: {
          spring: [
            'Passeggiata nel centro storico tra vicoli e piazze.',
            'Pausa in caffetteria con dolci tipici.',
          ],
          summer: [
            "Percorso all'ombra lungo il corso principale.",
            'Gelato o bibita fresca in piazza.',
          ],
          autumn: [
            'Botteghe artigiane e sapori di stagione.',
            'Pausa calda in un bar storico.',
          ],
          winter: [
            'Portici e chiese al coperto per una visita veloce.',
            'Cioccolata calda o dolce tipico.',
          ],
        },
      },
      {
        id: 'sulmona-comoda',
        label: 'Sosta comoda',
        duration: '2-3 ore',
        mealTip: 'Con 2-3 ore puoi fermarti per un pranzo tranquillo.',
        activities: {
          spring: [
            'Passeggiata più lunga tra quartieri storici e botteghe.',
            'Piccolo giro nei giardini urbani.',
          ],
          summer: [
            'Aperitivo leggero e passeggiata serale.',
            'Shopping di prodotti locali con calma.',
          ],
          autumn: [
            'Degustazione di prodotti locali e botteghe.',
            'Passeggiata lenta tra scorci fotografici.',
          ],
          winter: [
            'Visita a spazi culturali al chiuso.',
            'Pausa lunga con bevanda calda.',
          ],
        },
      },
    ],
  },
  {
    id: 2,
    name: 'Campo di Giove',
    alt: '1.064m',
    type: 'Sosta',
    stopDuration: '3 ore circa',
    timeHint: 'Spesso in fascia pranzo',
    desc: 'Ai piedi della Majella, incorniciata da fitti boschi e paesaggi mozzafiato.',
    plans: [
      {
        id: 'campo-breve',
        label: 'Sosta breve',
        duration: '60-75 min',
        mealTip: 'Se è ora di pranzo, preferisci un posto veloce vicino alla stazione.',
        activities: {
          spring: [
            'Belvedere e foto sulle cime circostanti.',
            'Passeggiata breve nei boschi vicini.',
          ],
          summer: [
            'Punto panoramico con aria fresca.',
            'Breve tratto ombreggiato e rifornimento acqua.',
          ],
          autumn: [
            'Foliage e colori del bosco.',
            'Pausa in centro per sapori di stagione.',
          ],
          winter: [
            'Scorci innevati e foto rapide.',
            'Riscaldati con una bevanda calda.',
          ],
        },
      },
      {
        id: 'campo-lunga',
        label: 'Sosta lunga',
        duration: '3 ore',
        mealTip: 'Con 3 ore puoi fare una camminata e poi pranzare con calma.',
        activities: {
          spring: [
            'Scampagnata su sentieri facili tra boschi e radure.',
            'Pranzo in trattoria o picnic se il tempo lo consente.',
          ],
          summer: [
            'Passeggiata fresca nel verde e relax.',
            "Pranzo all'aperto o in locale con cucina semplice.",
          ],
          autumn: [
            'Passeggiata tra i colori del bosco.',
            'Pranzo caldo con sapori stagionali.',
          ],
          winter: [
            'Camminata breve in sicurezza e panorama innevato.',
            'Pranzo sostanzioso al caldo.',
          ],
        },
      },
    ],
  },
  {
    id: 3,
    name: 'Palena',
    alt: '1.258m',
    type: 'Punto panoramico',
    stopDuration: '45-90 min',
    timeHint: 'Sosta rapida e rigenerante',
    desc: 'Stazione isolata nel Quarto Santa Chiara, regno della natura selvaggia.',
    plans: [
      {
        id: 'palena-lampo',
        label: 'Sosta lampo',
        duration: '30-45 min',
        mealTip: 'Se sei in fascia pranzo, punta a uno snack veloce.',
        activities: {
          spring: [
            'Belvedere e foto panoramiche.',
            'Passeggiata breve nei dintorni della stazione.',
          ],
          summer: [
            "Pausa all'ombra con vista aperta.",
            'Rifornisci acqua e riparti.',
          ],
          autumn: [
            'Scorci con foliage e foto.',
            'Sosta veloce in aria pulita.',
          ],
          winter: [
            'Panorama innevato da punto sicuro.',
            'Bevanda calda prima della ripartenza.',
          ],
        },
      },
      {
        id: 'palena-breve',
        label: 'Sosta breve',
        duration: '60-90 min',
        mealTip: "Con un po' di tempo, concediti una pausa seduto.",
        activities: {
          spring: [
            'Giro tranquillo nei dintorni con vista sui monti.',
            'Pausa caffetteria o merenda.',
          ],
          summer: [
            'Passeggiata più ampia con aria fresca.',
            'Sosta rinfrescante prima di ripartire.',
          ],
          autumn: [
            'Passeggiata lenta tra i colori.',
            'Botteghe locali e sapori di stagione.',
          ],
          winter: [
            'Visita breve al centro abitato.',
            'Pausa calda in bar o rifugio.',
          ],
        },
      },
    ],
  },
  {
    id: 4,
    name: 'Roccaraso',
    alt: '1.268m',
    type: 'Sosta',
    stopDuration: '90-180 min',
    timeHint: 'Perfetta per una passeggiata più lunga',
    desc: 'La stazione più alta della linea, rinomata per il turismo montano invernale ed estivo.',
    plans: [
      {
        id: 'roccaraso-breve',
        label: 'Sosta breve',
        duration: '60-90 min',
        mealTip: 'Se è ora di pranzo, scegli un posto vicino al centro.',
        activities: {
          spring: [
            'Passeggiata in centro e scorci montani.',
            'Pausa caffè con vista.',
          ],
          summer: [
            'Giro nel paese con aria fresca.',
            'Sosta rinfrescante e foto panoramiche.',
          ],
          autumn: [
            'Colori di stagione e botteghe.',
            'Pausa calda prima della ripartenza.',
          ],
          winter: [
            'Atmosfera montana e scorci innevati.',
            'Bevanda calda o dolce locale.',
          ],
        },
      },
      {
        id: 'roccaraso-lunga',
        label: 'Sosta lunga',
        duration: '2-3 ore',
        mealTip: 'Con 2-3 ore puoi pranzare e fare una passeggiata completa.',
        activities: {
          spring: [
            'Passeggiata più lunga in paese.',
            'Pranzo in trattoria con calma.',
          ],
          summer: [
            'Percorso nel verde e relax.',
            "Pranzo all'aperto o in locale tipico.",
          ],
          autumn: [
            'Sentiero facile tra i colori.',
            'Pranzo caldo con sapori di stagione.',
          ],
          winter: [
            'Attività invernali leggere o punti panoramici.',
            'Pranzo al caldo prima di rientrare.',
          ],
        },
      },
    ],
  },
  {
    id: 5,
    name: 'Castel di Sangro',
    alt: '793m',
    type: 'Capolinea',
    stopDuration: '2-4 ore',
    timeHint: 'Sosta più lunga, spesso in fascia pranzo',
    desc: "Città dell'acqua e della pesca a mosca, nodo cruciale dell'Alta Valle del Sangro.",
    plans: [
      {
        id: 'castel-breve',
        label: 'Sosta breve',
        duration: '60-90 min',
        mealTip: 'Se sei in fascia pranzo, punta a una trattoria vicino al centro.',
        activities: {
          spring: [
            'Passeggiata nel centro e foto lungo il corso.',
            'Pausa caffè in piazza.',
          ],
          summer: [
            'Passeggiata serale e gelato.',
            "Sosta fresca all'ombra.",
          ],
          autumn: [
            'Sapori locali e botteghe.',
            'Passeggiata tra vicoli e scorci.',
          ],
          winter: [
            'Centro storico e locali al chiuso.',
            'Bevanda calda e pausa rilassante.',
          ],
        },
      },
      {
        id: 'castel-lunga',
        label: 'Sosta lunga',
        duration: '3-4 ore',
        mealTip: 'Con una sosta lunga puoi pranzare senza fretta.',
        activities: {
          spring: [
            'Giro completo tra centro e aree verdi.',
            'Pranzo rilassato e passeggiata finale.',
          ],
          summer: [
            'Pausa lunga con pranzo e passeggiata.',
            'Aperitivo se arrivi nel tardo pomeriggio.',
          ],
          autumn: [
            'Percorso lento tra i colori e botteghe.',
            'Pranzo caldo con prodotti locali.',
          ],
          winter: [
            'Pranzo al caldo e visita tranquilla.',
            'Sosta in caffetteria prima del rientro.',
          ],
        },
      },
    ],
  },
];

function getInitialSeasonKey() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

function SeasonSelector({ seasons, selectedSeason, onChange, t }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {seasons.map((season) => {
        const isActive = season.key === selectedSeason;
        const Icon = season.icon;
        return (
          <button
            key={season.key}
            onClick={() => onChange(season.key)}
            className={`group flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
              isActive
                ? 'bg-primary text-primary-foreground border-primary/30 shadow-[var(--shadow-card)]'
                : 'bg-card/70 text-foreground/70 border-border/50 hover:text-foreground hover:bg-card'
            }`}
            aria-pressed={isActive}
            aria-label={t('activities.seasonAria', 'Seleziona stagione {{season}}', { season: season.label })}
          >
            <span
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isActive ? 'bg-primary-foreground/15' : 'bg-secondary text-muted-foreground'
              }`}
              aria-hidden="true"
            >
              <Icon size={16} weight={isActive ? 'fill' : 'duotone'} />
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold leading-tight">{season.label}</span>
              <span className={`block text-[11px] ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                {season.range}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TimePlanCard({ plan, seasonKey }) {
  return (
    <div className="bg-secondary/60 border border-border/50 rounded-3xl p-6 shadow-[var(--shadow-subtle)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-card flex items-center justify-center text-primary">
            <Clock size={16} weight="duotone" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{plan.label}</div>
            <div className="text-xs text-muted-foreground">{plan.duration}</div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.ul
          key={seasonKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="mt-4 flex flex-col gap-3"
        >
          {plan.activities[seasonKey].map((item, idx) => (
            <li key={`${seasonKey}-${plan.id}-${idx}`} className="flex gap-3 text-sm text-foreground/90">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>

      {plan.mealTip && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-border/50 bg-card/70 px-3 py-3 text-xs text-muted-foreground">
          <ForkKnife size={14} className="text-primary mt-0.5" />
          <span>{plan.mealTip}</span>
        </div>
      )}
    </div>
  );
}

function StopCard({ stop, seasonKey, index, t }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 110, damping: 20 }}
      className="bg-card rounded-3xl p-8 md:p-10 shadow-[var(--shadow-card)]"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3 text-xs">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary/8 text-primary font-semibold">
              <MapPin size={14} weight="fill" /> {stop.type}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-secondary text-muted-foreground font-semibold">
              <Train size={14} /> {t('activities.altitude', 'Altitudine')}: {stop.alt}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-secondary text-muted-foreground font-semibold">
              <Clock size={14} /> {t('activities.typicalStop', 'Sosta tipica')}: {stop.stopDuration}
            </span>
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground">{stop.name}</h2>
            <p className="text-muted-foreground mt-2 max-w-[65ch]">{stop.desc}</p>
            <p className="text-sm text-muted-foreground mt-2 italic">{stop.timeHint}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {stop.plans.map((plan) => (
            <TimePlanCard key={plan.id} plan={plan} seasonKey={seasonKey} />
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function ComeSalire() {
  const { t, tm } = useI18n();
  const [selectedSeason, setSelectedSeason] = useState(getInitialSeasonKey());
  const seasons = useMemo(
    () =>
      DEFAULT_SEASONS.map((season) => ({
        ...season,
        label: t(`activities.seasons.${season.key}.label`, season.label),
        range: t(`activities.seasons.${season.key}.range`, season.range),
      })),
    [t],
  );
  const seasonCopy = tm('activities.seasonCopy', DEFAULT_SEASON_COPY);
  const stops = tm('activities.stops', DEFAULT_STOPS);

  const activeSeason = useMemo(() => {
    return seasons.find((season) => season.key === selectedSeason) || seasons[0];
  }, [selectedSeason, seasons]);
  const ActiveIcon = activeSeason.icon;

  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/8 text-primary font-semibold text-sm mb-6"
        >
          <Sparkle weight="fill" size={16} />
          {t('activities.badge', 'Attività consigliate')}
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-[-0.03em] mb-6 text-foreground">
          {t('activities.title', 'Cosa fare durante le fermate')}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-[60ch] mx-auto">
          {t(
            'activities.subtitle',
            'Seleziona la stagione e scopri cosa fare nelle città in cui il treno si ferma, con suggerimenti calibrati sulla durata della sosta.',
          )}
        </p>
        <p className="text-sm text-muted-foreground mt-4 italic">
          {t('activities.note', 'Durate indicative: aggiorneremo gli orari appena disponibili.')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-14">
        <SeasonSelector seasons={seasons} selectedSeason={selectedSeason} onChange={setSelectedSeason} t={t} />
        <motion.div
          key={selectedSeason}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <span className="w-7 h-7 rounded-xl bg-secondary flex items-center justify-center text-primary">
            <ActiveIcon size={14} weight="duotone" />
          </span>
          <span>{seasonCopy[selectedSeason]}</span>
        </motion.div>
      </div>

      <div className="flex flex-col gap-10">
        {stops.map((stop, index) => (
          <StopCard key={stop.id} stop={stop} seasonKey={selectedSeason} index={index} t={t} />
        ))}
      </div>
    </div>
  );
}
