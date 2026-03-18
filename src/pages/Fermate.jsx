import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Train, Tree, NavigationArrow } from '@phosphor-icons/react';
import { useI18n } from '../i18n/index.jsx';
import ImageCredit from '../components/ImageCredit';

const DEFAULT_STATIONS = [
  {
    id: 1,
    name: 'Sulmona',
    viaggiaName: 'Sulmona',
    trainlineCode: '20737',
    alt: '328m',
    type: 'Partenza',
    desc: 'La città dei confetti e di Ovidio. Punto di partenza dell\'itinerario storico.',
    photo: '/photos/fermate/sulmona-fermata.webp',
    mapQuery: 'Stazione di Sulmona, Sulmona, Abruzzo',
    glow: 'rgba(34, 197, 94, 0.35)',
  },
  {
    id: 2,
    name: 'Campo di Giove',
    viaggiaName: 'Campo di Giove',
    trainlineCode: '21214',
    alt: '1.064m',
    type: 'Sosta',
    desc: 'Ai piedi della Majella, incorniciata da fitti boschi e paesaggi mozzafiato.',
    photo: '/photos/fermate/campo-di-giove.webp',
    mapQuery: 'Stazione di Campo di Giove, Campo di Giove, Abruzzo',
    glow: 'rgba(59, 130, 246, 0.35)',
  },
  {
    id: 3,
    name: 'Palena',
    viaggiaName: 'Palena',
    trainlineCode: '21371',
    alt: '1.258m',
    type: 'Punto panoramico',
    desc: 'Stazione isolata nel Quarto Santa Chiara, regno della natura selvaggia.',
    photo: '/photos/fermate/palena.webp',
    mapQuery: 'Stazione di Palena, Palena, Abruzzo',
    glow: 'rgba(16, 185, 129, 0.32)',
  },
  {
    id: 4,
    name: 'Roccaraso',
    viaggiaName: 'Roccaraso',
    trainlineCode: '20655',
    alt: '1.268m',
    type: 'Sosta',
    desc: 'La stazione più alta della linea, rinomata per il turismo montano invernale ed estivo.',
    photo: '/photos/fermate/roccaraso.webp',
    mapQuery: 'Stazione di Roccaraso, Roccaraso, Abruzzo',
    glow: 'rgba(59, 130, 246, 0.32)',
  },
  {
    id: 5,
    name: 'Castel di Sangro',
    viaggiaName: 'Castel di Sangro',
    trainlineCode: '19856',
    alt: '793m',
    type: 'Capolinea',
    desc: 'Città dell\'acqua e della pesca a mosca, nodo cruciale dell\'Alta Valle del Sangro.',
    photo: '/photos/fermate/castel-di-sangro.webp',
    mapQuery: 'Stazione di Castel di Sangro, Castel di Sangro, Abruzzo',
    glow: 'rgba(14, 116, 144, 0.32)',
  }
];

const TRAINLINE_BASE = 'https://www.thetrainline.com/book/results';
const TRAINLINE_DEFAULTS = {
  journeySearchType: 'single',
  outwardDateType: 'departAfter',
  selectedTab: 'train',
  splitSave: 'true',
  lang: 'it',
  transportModes: 'mixed',
  passengerDob: '1990-01-01',
};

const TRAINLINE_ROUTE_OVERRIDES = [
  {
    origin: 'Campo di Giove',
    destination: 'Palena',
    selectedTab: 'coach',
    transportModes: 'coach',
  },
];

function TrainlineLogo() {
  return (
    <img
      src="/logos/trainline-mint.svg"
      alt="Trainline"
      className="h-7 w-auto"
      loading="lazy"
      decoding="async"
    />
  );
}

function buildTrainlineLink({ originCode, destinationCode, originName, destinationName, interfaceLang }) {
  if (!originCode || !destinationCode) {
    return 'https://www.thetrainline.com/journey-planner/';
  }
  const when = new Date();
  const outwardDate = when.toISOString().slice(0, 19);
  const override =
    TRAINLINE_ROUTE_OVERRIDES.find(
      (item) => item.origin === originName && item.destination === destinationName
    ) || {};
  const params = new URLSearchParams({
    journeySearchType: TRAINLINE_DEFAULTS.journeySearchType,
    origin: `urn:trainline:generic:loc:${originCode}`,
    destination: `urn:trainline:generic:loc:${destinationCode}`,
    outwardDate,
    outwardDateType: TRAINLINE_DEFAULTS.outwardDateType,
    selectedTab: override.selectedTab || TRAINLINE_DEFAULTS.selectedTab,
    splitSave: TRAINLINE_DEFAULTS.splitSave,
    lang: interfaceLang || TRAINLINE_DEFAULTS.lang,
    'transportModes[]': override.transportModes || TRAINLINE_DEFAULTS.transportModes,
    'passengers[0]': TRAINLINE_DEFAULTS.passengerDob,
  });
  return `${TRAINLINE_BASE}?${params.toString()}`;
}

function buildMapUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function StationButton({ station, isActive, onClick, index }) {
  const { t } = useI18n();

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 120, damping: 22 }}
      style={{ '--station-glow': station.glow }}
      className={`w-full text-left p-5 rounded-2xl transition-all duration-300 relative overflow-hidden flex items-center justify-between group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background
        ${isActive 
          ? 'bg-card/70 backdrop-blur-xl border border-border/70 shadow-[0_12px_32px_-18px_var(--station-glow)] shadow-[var(--shadow-card)]' 
          : 'bg-card/55 backdrop-blur-lg border border-border/60 hover:shadow-[var(--shadow-subtle)] hover:scale-[1.01]'
        }
      `}
      aria-pressed={isActive}
      aria-label={t('stops.stationAria', 'Stazione di {{name}}, {{type}}, altitudine {{alt}}', {
        name: station.name,
        type: station.type,
        alt: station.alt,
      })}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${station.photo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(6px)',
          transform: 'scale(1.08)',
          opacity: isActive ? 0.5 : 0.25,
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-card/85 via-card/65 to-card/40" aria-hidden="true" />
      <div className="flex items-center gap-4 z-10 relative">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
          isActive 
            ? 'bg-primary text-primary-foreground shadow-[var(--shadow-subtle)]' 
            : 'bg-secondary text-muted-foreground'
        }`}>
          <MapPin weight={isActive ? "fill" : "regular"} size={20} />
        </div>
        <div>
          <div className={`font-bold text-lg tracking-tight transition-colors ${isActive ? 'text-primary' : 'text-foreground'}`}>
            {station.name}
          </div>
          <div className="text-sm text-muted-foreground mt-0.5 italic">{station.type}</div>
        </div>
      </div>
      
      <div className={`z-10 relative transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'}`}>
        <ArrowRight size={20} weight="bold" className={isActive ? 'text-primary' : 'text-muted-foreground'} />
      </div>
    </motion.button>
  );
}

export default function Fermate() {
  const { t, tm, lang } = useI18n();
  const isItalian = lang === 'it';
  const stations = tm('stops.stations', DEFAULT_STATIONS);
  const [selectedStation, setSelectedStation] = useState(stations[0]);
  const [origin, setOrigin] = useState(stations[0].name);
  const [destination, setDestination] = useState(stations[stations.length - 1].name);

  const destinationOptions = useMemo(() => {
    return stations.map((station) => station.name);
  }, [stations]);

  const originCodes = useMemo(() => {
    return stations.reduce((acc, station) => {
      acc[station.name] = station.trainlineCode;
      return acc;
    }, {});
  }, [stations]);

  useEffect(() => {
    setSelectedStation((current) => stations.find((station) => station.id === current.id) || stations[0]);
  }, [stations]);

  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-[-0.03em] mb-4 text-foreground">{t('stops.title', 'Le fermate')}</h1>
        <p className="text-lg text-muted-foreground max-w-[65ch] leading-relaxed">
          {t(
            'stops.subtitle',
            "Esplora le stazioni storiche lungo la ferrovia più alta e panoramica d'Italia, un nastro d'acciaio che cuce parchi nazionali e riserve naturali.",
          )}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-2" role="listbox" aria-label={t('stops.listAria', 'Lista delle stazioni')}>
          <div className="relative">
            {stations.map((station, i) => (
              <div key={station.id} className="relative">
                {i < stations.length - 1 && (
                  <div className="absolute left-[1.85rem] top-[3.5rem] w-0.5 h-[calc(100%-1rem)] bg-border/60 z-0" aria-hidden="true" />
                )}
                <div className="relative z-10 mb-2">
                  <StationButton
                    station={station}
                    isActive={selectedStation.id === station.id}
                    onClick={() => setSelectedStation(station)}
                    index={i}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.article
              key={selectedStation.id}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="h-full bg-card rounded-3xl p-0 shadow-[var(--shadow-elevated)] flex flex-col justify-between overflow-hidden border border-border/60"
              aria-live="polite"
              aria-label={t('stops.detailAria', 'Dettagli stazione: {{name}}', { name: selectedStation.name })}
            >
              <div className="relative h-56 md:h-64 w-full overflow-hidden">
                <img
                  src={selectedStation.photo}
                  alt={t('stops.imageAlt', 'Stazione di {{name}}', { name: selectedStation.name })}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <ImageCredit
                  src={selectedStation.photo}
                  className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1 text-[10px] text-white/90"
                  linkClassName="text-white/90 hover:text-white"
                />
              </div>
              <motion.div
                className="px-8 md:px-12 pt-8"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-card/80 border border-border text-primary font-semibold text-sm mb-8">
                  <Tree weight="fill" size={16} />
                  {t('stops.altitude', 'Altitudine')}: {selectedStation.alt}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-5 text-foreground">
                  {selectedStation.name}
                </h2>
                <p className="text-[0.98rem] leading-relaxed text-foreground/85 max-w-[50ch]">
                  {selectedStation.desc}
                </p>
              </motion.div>

              <motion.div
                className="mt-8 px-8 md:px-12"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="rounded-3xl border border-border/60 bg-card/70 backdrop-blur-xl p-5 shadow-[var(--shadow-card)]">
                  <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 via-background/80 to-background/60 p-5">
                    <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                          <MapPin weight="fill" size={16} />
                          {selectedStation.name}
                        </div>
                      </div>
                      <a
                        href={buildMapUrl(selectedStation.mapQuery || selectedStation.name)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary/90 px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-all duration-300 hover:translate-y-[-1px] hover:bg-primary hover:shadow-[0_18px_48px_-26px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background md:w-auto"
                      >
                        {isItalian ? 'Apri su Google Maps' : 'Open in Google Maps'}
                        <NavigationArrow size={16} weight="bold" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="mt-10 px-8 md:px-12 pb-12 pt-8 border-t border-border/50"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="rounded-3xl border border-border/60 bg-card/70 backdrop-blur-xl p-6 shadow-[var(--shadow-card)]">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground italic">
                        {t('stops.trainline.eyebrow', 'Orari, biglietti e disponibilita')}
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-sm font-semibold text-foreground">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                          <Train className="text-primary" size={18} />
                        </div>
                        {t('stops.trainline.line', 'Linea storica')}
                      </div>
                    </div>
                    <a
                      href={buildTrainlineLink({
                        originCode: originCodes[origin],
                        destinationCode: originCodes[destination],
                        originName: origin,
                        destinationName: destination,
                        interfaceLang: t('stops.trainline.lang', 'it'),
                      })}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 rounded-2xl bg-primary px-5 py-3 text-sm md:text-base font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_18px_48px_-26px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background"
                    >
                      {t('stops.trainline.cta', 'Acquista su Trainline')}
                      <NavigationArrow size={16} weight="bold" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
                      {t('stops.trainline.origin', 'Partenza')}
                      <select
                        className="h-11 rounded-2xl border border-border/60 bg-background/70 px-4 text-sm font-medium text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                        value={origin}
                        onChange={(event) => setOrigin(event.target.value)}
                      >
                        {stations.map((station) => (
                          <option key={station.id} value={station.name}>
                            {station.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
                      {t('stops.trainline.destination', 'Arrivo')}
                      <select
                        className="h-11 rounded-2xl border border-border/60 bg-background/70 px-4 text-sm font-medium text-foreground focus-visible:ring-2 focus-visible:ring-primary"
                        value={destination}
                        onChange={(event) => setDestination(event.target.value)}
                      >
                        {destinationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
                    <div className="text-sm font-semibold text-muted-foreground">
                      {t('stops.trainline.poweredBy', 'Servizio biglietti fornito da')}
                    </div>
                    <a
                      href="https://www.thetrainline.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center"
                      aria-label="Trainline"
                    >
                      <TrainlineLogo />
                    </a>
                  </div>

                </div>
              </motion.div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
