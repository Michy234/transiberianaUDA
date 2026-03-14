import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Train, Tree, NavigationArrow } from '@phosphor-icons/react';

const stations = [
  {
    id: 1,
    name: 'Sulmona',
    viaggiaName: 'Sulmona',
    trainlineCode: '20737',
    alt: '328m',
    type: 'Partenza',
    desc: 'La città dei confetti e di Ovidio. Punto di partenza dell\'itinerario storico.',
    photo: '/photos/fermate/sulmona-fermata.jpg',
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
    photo: '/photos/fermate/campo-di-giove.jpg',
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
    photo: '/photos/fermate/palena.jpg',
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
    photo: '/photos/fermate/roccaraso.jpg',
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
    photo: '/photos/fermate/castel-di-sangro.jpg',
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

function normalizeStationName(value) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function formatTime(timeValue) {
  if (!timeValue) return '';
  if (typeof timeValue === 'string') return timeValue;
  if (typeof timeValue === 'number') {
    const date = new Date(timeValue);
    return date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  }
  return '';
}

function buildDepartureDate(departure) {
  if (!departure) return new Date();
  if (departure.datetime) return new Date(departure.datetime);
  if (departure.date && departure.time) {
    return new Date(`${departure.date}T${departure.time}:00`);
  }
  return new Date();
}

function buildTrainlineLink({ originCode, destinationCode, departure, originName, destinationName }) {
  if (!originCode || !destinationCode) {
    return 'https://www.thetrainline.com/journey-planner/';
  }
  const when = buildDepartureDate(departure);
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
    lang: TRAINLINE_DEFAULTS.lang,
    'transportModes[]': override.transportModes || TRAINLINE_DEFAULTS.transportModes,
    'passengers[0]': TRAINLINE_DEFAULTS.passengerDob,
  });
  return `${TRAINLINE_BASE}?${params.toString()}`;
}

function StationButton({ station, isActive, onClick, index }) {
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
      aria-label={`Stazione di ${station.name}, ${station.type}, altitudine ${station.alt}`}
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
  const [selectedStation, setSelectedStation] = useState(stations[0]);
  const [origin, setOrigin] = useState(stations[0].name);
  const [destination, setDestination] = useState(stations[stations.length - 1].name);
  const [schedule, setSchedule] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const destinationOptions = useMemo(() => {
    return stations.map((station) => station.name);
  }, []);

  const originCodes = useMemo(() => {
    return stations.reduce((acc, station) => {
      acc[station.name] = station.trainlineCode;
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSchedule() {
      setIsLoading(true);
      setError(null);
      try {
        if (isMounted) {
          const response = await fetch('/data/orari.json');
          if (!response.ok) throw new Error('Impossibile caricare gli orari.');
          const json = await response.json();
          setSchedule(json.stations || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Errore durante il recupero degli orari.');
          setSchedule([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSchedule();
    return () => {
      isMounted = false;
    };
  }, []);

  const departures = useMemo(() => {
    const originEntry = schedule.find((station) => station.name === origin);
    if (!originEntry) return [];
    return originEntry.departures.filter((departure) =>
      normalizeStationName(departure.to).includes(normalizeStationName(destination))
    );
  }, [schedule, origin, destination]);

  useEffect(() => {
    if (departures.length === 0) {
      setSelectedDeparture(null);
      return;
    }
    if (!selectedDeparture || !departures.includes(selectedDeparture)) {
      setSelectedDeparture(departures[0]);
    }
  }, [departures, selectedDeparture]);

  return (
    <div className="min-h-[100dvh] pt-32 pb-24 px-6 md:px-12 max-w-[1400px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-[-0.03em] mb-4 text-foreground">Le fermate</h1>
        <p className="text-lg text-muted-foreground max-w-[65ch] leading-relaxed">
          Esplora le stazioni storiche lungo la ferrovia più alta e panoramica d'Italia, un nastro d'acciaio che cuce parchi nazionali e riserve naturali.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-2" role="listbox" aria-label="Lista delle stazioni">
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
              aria-label={`Dettagli stazione: ${selectedStation.name}`}
            >
              <div className="relative h-56 md:h-64 w-full overflow-hidden">
                <img
                  src={selectedStation.photo}
                  alt={`Stazione di ${selectedStation.name}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
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
                  Altitudine: {selectedStation.alt}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-5 text-foreground">
                  {selectedStation.name}
                </h2>
                <p className="text-[0.98rem] leading-relaxed text-foreground/85 max-w-[50ch]">
                  {selectedStation.desc}
                </p>
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
                        Orari, biglietti e disponibilita
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-sm font-semibold text-foreground">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                          <Train className="text-primary" size={18} />
                        </div>
                        Linea storica
                      </div>
                    </div>
                    <a
                      href={buildTrainlineLink({
                        originCode: originCodes[origin],
                        destinationCode: originCodes[destination],
                        departure: selectedDeparture,
                        originName: origin,
                        destinationName: destination,
                      })}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 rounded-2xl bg-primary px-5 py-3 text-sm md:text-base font-semibold text-primary-foreground shadow-[var(--shadow-elevated)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_18px_48px_-26px_rgba(0,0,0,0.35)] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-background"
                    >
                      Acquista su Trainline
                      <NavigationArrow size={16} weight="bold" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-2 text-sm font-semibold text-foreground">
                      Partenza
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
                      Arrivo
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

                  <div className="mt-6 space-y-3">
                    {isLoading && (
                      <div className="text-sm text-muted-foreground">Caricamento orari...</div>
                    )}
                    {!isLoading && error && (
                      <div className="text-sm text-red-500">{error}</div>
                    )}
                    {!isLoading && !error && departures.length === 0 && (
                      <div className="text-sm text-muted-foreground">
                        Nessuna partenza trovata per la tratta selezionata.
                      </div>
                    )}
                    {!isLoading &&
                      !error &&
                      departures.slice(0, 6).map((departure) => {
                        const isActive = selectedDeparture?.numeroTreno === departure.numeroTreno;
                        return (
                          <button
                            key={`${departure.numeroTreno}-${departure.orarioPartenza}`}
                            type="button"
                            onClick={() => setSelectedDeparture(departure)}
                            className={`w-full text-left rounded-2xl border px-4 py-3 transition-all ${
                              isActive
                                ? 'border-primary/60 bg-primary/10 text-foreground'
                                : 'border-border/60 bg-background/70 text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold">
                              {formatTime(departure.time)}
                            </div>
                            <div className="text-xs font-semibold">
                              Treno {departure.trainNo || '—'}
                            </div>
                          </div>
                          <div className="text-xs mt-1">
                              Destinazione: {departure.to || destination}
                          </div>
                        </button>
                      );
                    })}
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
