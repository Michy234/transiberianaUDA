import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

const DEMO_STATIONS = [
  {
    name: 'Roma Termini',
    viaggiaName: 'Roma Termini',
  },
  {
    name: 'Napoli Centrale',
    viaggiaName: 'Napoli Centrale',
  },
  {
    name: 'Salerno',
    viaggiaName: 'Salerno',
  },
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

const VIAGGIATRENO_PROXY_BASE = '/api/viaggiatreno';
const VIAGGIATRENO_DEFAULT_BASE = 'http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno';
const VIAGGIATRENO_HTTPS_BASE = 'https://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatViaggiaTrenoDate(date) {
  const pad = (value) => String(value).padStart(2, '0');
  const tzOffset = -date.getTimezoneOffset();
  const sign = tzOffset >= 0 ? '+' : '-';
  const absOffset = Math.abs(tzOffset);
  const tzHours = pad(Math.floor(absOffset / 60));
  const tzMinutes = pad(absOffset % 60);
  return `${DAY_NAMES[date.getDay()]} ${MONTH_NAMES[date.getMonth()]} ${pad(date.getDate())} ${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} GMT${sign}${tzHours}${tzMinutes}`;
}

function normalizeStationName(value) {
  if (!value) return '';
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

async function fetchJsonWithFallback({ label, path, signal, pushDebug, activeBaseRef }) {
  const candidates = [
    import.meta.env.VITE_VIAGGIATRENO_BASE,
    VIAGGIATRENO_PROXY_BASE,
    VIAGGIATRENO_HTTPS_BASE,
    VIAGGIATRENO_DEFAULT_BASE,
  ].filter(Boolean);
  let lastError = null;

  for (const base of candidates) {
    const url = base.startsWith('http') ? `${base}/${path}` : `${base}/${path}`;
    const startedAt = Date.now();
    try {
      const response = await fetch(url, { signal, headers: { Accept: 'application/json' }, cache: 'no-store' });
      const raw = await response.text();
      let data = null;
      let parseError = null;
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch (error) {
          parseError = error;
        }
      }
      pushDebug?.({
        label,
        url,
        status: response.status,
        ok: response.ok,
        durationMs: Date.now() - startedAt,
        error: parseError ? 'json_parse_error' : null,
        sample: raw ? raw.slice(0, 240) : '',
      });
      if (!response.ok) {
        throw new Error(`http_${response.status}`);
      }
      if (parseError) {
        throw parseError;
      }
      if (activeBaseRef) {
        activeBaseRef.current = base;
      }
      return data;
    } catch (error) {
      lastError = error;
      pushDebug?.({
        label,
        url,
        status: null,
        ok: false,
        durationMs: Date.now() - startedAt,
        error: error?.message || 'fetch_failed',
      });
    }
  }

  throw lastError || new Error('fetch_failed');
}

async function fetchStationCode(name, signal, pushDebug, activeBaseRef) {
  const results = await fetchJsonWithFallback({
    label: `cercaStazione ${name}`,
    path: `cercaStazione/${encodeURIComponent(name)}`,
    signal,
    pushDebug,
    activeBaseRef,
  });
  if (!Array.isArray(results) || results.length === 0) return null;
  const normalized = normalizeStationName(name);
  const exact =
    results.find((item) => normalizeStationName(item.nomeBreve) === normalized) ||
    results.find((item) => normalizeStationName(item.nomeLungo) === normalized);
  const fallback =
    exact ||
    results.find((item) => normalizeStationName(item.nomeBreve).startsWith(normalized)) ||
    results.find((item) => normalizeStationName(item.nomeLungo).startsWith(normalized)) ||
    results[0];
  return fallback?.id || null;
}

async function fetchDepartures(stationCode, signal, pushDebug, activeBaseRef) {
  const timestamp = formatViaggiaTrenoDate(new Date());
  const data = await fetchJsonWithFallback({
    label: `partenze ${stationCode}`,
    path: `partenze/${stationCode}/${encodeURIComponent(timestamp)}`,
    signal,
    pushDebug,
    activeBaseRef,
  });
  return Array.isArray(data) ? data : [];
}

function getMidnightTimestamp(item) {
  if (item?.dataPartenzaTreno && Number.isFinite(item.dataPartenzaTreno)) {
    return item.dataPartenzaTreno;
  }
  if (item?.millisDataPartenza) {
    const parsed = Number(item.millisDataPartenza);
    if (Number.isFinite(parsed)) return parsed;
  }
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return midnight.getTime();
}

async function fetchTrainStatus(originCode, trainNumber, midnightTs, signal, pushDebug, activeBaseRef) {
  if (!originCode || !trainNumber || !midnightTs) return null;
  const data = await fetchJsonWithFallback({
    label: `andamentoTreno ${trainNumber}`,
    path: `andamentoTreno/${originCode}/${encodeURIComponent(trainNumber)}/${midnightTs}`,
    signal,
    pushDebug,
    activeBaseRef,
  });
  return data;
}

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

function EmptySegmentState({ segment, data, isItalian }) {
  const destinations = data?.rawDestinations?.length ? data.rawDestinations.join(', ') : null;
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 px-4 py-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-full border border-border/60 bg-card flex items-center justify-center text-muted-foreground/70">
          <Train size={18} weight="bold" />
        </div>
        <div>
          <div className="text-foreground/80 font-semibold">
            {isItalian ? 'Nessun treno in transito' : 'No trains in transit'}
          </div>
          <div className="text-xs text-muted-foreground">
            {isItalian ? `Tratto ${segment.from} → ${segment.to}` : `Segment ${segment.from} → ${segment.to}`}
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
        <span className="h-1.5 w-1.5 rounded-full bg-border/80" />
        <span className="flex-1 border-t border-dashed border-border/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-border/80" />
      </div>
      <div className="mt-3 text-xs">
        {isItalian
          ? `Nessun diretto per ${segment.to}. Partenze totali: ${data?.rawCount ?? 0}${destinations ? ` · Destinazioni: ${destinations}` : ''}`
          : `No direct trains to ${segment.to}. Total departures: ${data?.rawCount ?? 0}${destinations ? ` · Destinations: ${destinations}` : ''}`}
      </div>
    </div>
  );
}

export default function Fermate() {
  const { t, tm, lang } = useI18n();
  const isItalian = lang === 'it';
  const stations = tm('stops.stations', DEFAULT_STATIONS);
  const [selectedStation, setSelectedStation] = useState(stations[0]);
  const [origin, setOrigin] = useState(stations[0].name);
  const [destination, setDestination] = useState(stations[stations.length - 1].name);
  const [liveState, setLiveState] = useState({
    status: 'idle',
    segments: [],
    updatedAt: null,
    error: null,
  });
  const [liveMode, setLiveMode] = useState('transiberiana');
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const [activeBase, setActiveBase] = useState(null);
  const activeBaseRef = React.useRef(null);

  const destinationOptions = useMemo(() => {
    return stations.map((station) => station.name);
  }, [stations]);

  const originCodes = useMemo(() => {
    return stations.reduce((acc, station) => {
      acc[station.name] = station.trainlineCode;
      return acc;
    }, {});
  }, [stations]);

  const liveStations = useMemo(() => (
    liveMode === 'demo' ? DEMO_STATIONS : stations
  ), [liveMode, stations]);

  const liveStationLookup = useMemo(() => {
    return liveStations.reduce((acc, station) => {
      acc[station.name] = station.viaggiaName || station.name;
      return acc;
    }, {});
  }, [liveStations]);

  const liveSegments = useMemo(() => {
    return liveStations.slice(0, -1).map((station, index) => ({
      from: station.name,
      to: liveStations[index + 1].name,
    }));
  }, [liveStations]);

  const pushDebug = useCallback((entry) => {
    if (!debugEnabled) return;
    setDebugLogs((prev) => [entry, ...prev].slice(0, 20));
  }, [debugEnabled]);

  const toggleDebug = useCallback(() => {
    setDebugEnabled((prev) => {
      const next = !prev;
      setDebugOpen(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const demoObj = {};
    Object.defineProperty(demoObj, 'toggle', {
      get() {
        toggleDebug();
        return toggleDebug;
      },
    });
    window.demo = demoObj;
    return () => {
      if (window.demo === demoObj) {
        delete window.demo;
      }
    };
  }, [toggleDebug]);

  const resolvedBase =
    activeBase ||
    import.meta.env.VITE_VIAGGIATRENO_BASE ||
    VIAGGIATRENO_PROXY_BASE ||
    VIAGGIATRENO_HTTPS_BASE ||
    VIAGGIATRENO_DEFAULT_BASE;
  const isHttpsPage = typeof window !== 'undefined' && window.location?.protocol === 'https:';
  const isHttpBase = resolvedBase?.startsWith('http://');
  const resolvedBaseLabel =
    resolvedBase?.startsWith('http')
      ? resolvedBase
      : typeof window !== 'undefined'
        ? `${window.location.origin}${resolvedBase}`
        : resolvedBase;

  useEffect(() => {
    setSelectedStation((current) => stations.find((station) => station.id === current.id) || stations[0]);
  }, [stations]);

  const loadLiveTrains = useCallback(async (signal) => {
    setLiveState((prev) => ({ ...prev, status: 'loading', error: null }));
    setDebugLogs([]);
    const stationNames = [...new Set(liveSegments.flatMap((segment) => [segment.from]))];
    const stationEntries = await Promise.all(
      stationNames.map(async (name) => {
        const queryName = liveStationLookup[name] || name;
        try {
          return {
            name,
            code: await fetchStationCode(queryName, signal, pushDebug, activeBaseRef),
            error: null,
          };
        } catch (error) {
          return {
            name,
            code: null,
            error: error?.message || 'station_lookup_failed',
          };
        }
      }),
    );
    const stationMap = stationEntries.reduce((acc, item) => {
      acc[item.name] = item.code;
      return acc;
    }, {});

    const segmentData = await Promise.all(
      liveSegments.map(async (segment) => {
        const originCode = stationMap[segment.from];
        if (!originCode) {
          return { ...segment, status: 'missing', trains: [] };
        }
        let departures = [];
        try {
          departures = await fetchDepartures(originCode, signal, pushDebug, activeBaseRef);
        } catch (error) {
          return { ...segment, status: 'error', trains: [], error: error?.message || 'departures_failed' };
        }
        const rawCount = departures.length;
        const rawDestinations = Array.from(
          new Set(
            departures
              .map((item) => item.destinazione)
              .filter((value) => value && typeof value === 'string'),
          ),
        ).slice(0, 4);
        const destinationKey = normalizeStationName(segment.to);
        const trains = departures
          .filter((item) => normalizeStationName(item.destinazione) === destinationKey)
          .slice(0, 3)
          .map((item) => ({
            number: item.numeroTreno,
            category: item.categoriaDescrizione?.trim() || item.categoria || '',
            destination: item.destinazione,
            departure:
              item.compOrarioPartenza ||
              item.compOrarioPartenzaZero ||
              item.compOrarioPartenzaZeroEffettivo ||
              '--:--',
            delay: Number.isFinite(item.ritardo) ? item.ritardo : 0,
            platform:
              item.binarioEffettivoPartenzaDescrizione ||
              item.binarioProgrammatoPartenzaDescrizione ||
              null,
            statusCode: item.provvedimento,
          }));

        let debugMatches = [];
        if (debugEnabled) {
          const sample = departures.slice(0, 4);
          debugMatches = await Promise.all(
            sample.map(async (item) => {
              const trainNumber = item.numeroTreno;
              const originOverride =
                item.codOrigine ||
                item.idOrigine ||
                item.codiceOrigine ||
                originCode;
              const midnightTs = getMidnightTimestamp(item);
              try {
                const status = await fetchTrainStatus(
                  originOverride,
                  trainNumber,
                  midnightTs,
                  signal,
                  pushDebug,
                  activeBaseRef,
                );
                const stops = Array.isArray(status?.fermate) ? status.fermate : [];
                const stopNames = stops.map((stop) =>
                  normalizeStationName(stop?.stazione || stop?.nomeStazione || stop?.nomeBreve || stop?.nomeLungo),
                );
                const hasStop = stopNames.includes(destinationKey);
                return {
                  number: trainNumber,
                  originCode: originOverride,
                  midnightTs,
                  hasStop,
                  stopsPreview: stops
                    .map((stop) => stop?.stazione || stop?.nomeStazione || stop?.nomeBreve || stop?.nomeLungo)
                    .filter(Boolean)
                    .slice(0, 4),
                };
              } catch (error) {
                return {
                  number: trainNumber,
                  originCode: originOverride,
                  hasStop: false,
                  error: error?.message || 'andamento_failed',
                };
              }
            }),
          );
        }

        return {
          ...segment,
          status: trains.length ? 'ok' : 'empty',
          trains,
          rawCount,
          rawDestinations,
          debugMatches,
        };
      }),
    );

    const hasErrors = stationEntries.some((item) => item.error) || segmentData.some((item) => item.status === 'error');
    setLiveState({
      status: hasErrors ? 'partial' : 'ready',
      segments: segmentData,
      updatedAt: new Date(),
      error: hasErrors ? 'partial' : null,
    });
    setActiveBase(activeBaseRef.current);
  }, [debugEnabled, liveSegments, liveStationLookup, pushDebug]);

  const handleRefresh = useCallback(() => {
    const controller = new AbortController();
    loadLiveTrains(controller.signal).catch((error) => {
      setLiveState((prev) => ({
        ...prev,
        status: 'error',
        error: error?.message || 'unknown',
      }));
    });
  }, [loadLiveTrains]);

  useEffect(() => {
    if (!debugEnabled) return;
    handleRefresh();
  }, [debugEnabled, handleRefresh]);

  const handleCopyDebug = useCallback(async () => {
    const payload = {
      base: resolvedBase,
      pageProtocol: typeof window !== 'undefined' ? window.location?.protocol : null,
      updatedAt: liveState.updatedAt ? liveState.updatedAt.toISOString() : null,
      status: liveState.status,
      error: liveState.error,
      mode: liveMode,
      segments: liveSegments,
      logs: debugLogs,
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    } catch (error) {
      console.error(error);
    }
  }, [debugLogs, liveMode, liveSegments, liveState, resolvedBase]);

  useEffect(() => {
    const controller = new AbortController();
    loadLiveTrains(controller.signal).catch((error) => {
      if (error?.name === 'AbortError') return;
      setLiveState((prev) => ({
        ...prev,
        status: 'error',
        error: error?.message || 'unknown',
      }));
    });
    return () => controller.abort();
  }, [loadLiveTrains]);

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
                <div className="rounded-3xl border border-border/60 bg-card/70 backdrop-blur-xl p-6 shadow-[var(--shadow-card)]">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="text-sm font-semibold text-muted-foreground italic">
                        {isItalian ? 'Locali e punti di interesse nei dintorni' : 'Nearby places and points of interest'}
                      </div>
                      <div className="text-xs font-semibold text-foreground/70">Google Maps</div>
                    </div>
                  <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 p-6">
                    <div className="flex h-64 flex-col justify-between md:h-72">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-primary/8 px-4 py-2 text-sm font-semibold text-primary">
                          <MapPin weight="fill" size={16} />
                          {selectedStation.name}
                        </div>
                        <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
                          {isItalian
                            ? 'La mappa non viene incorporata direttamente nella demo per evitare il caricamento automatico di servizi esterni. Puoi aprire Google Maps solo se vuoi farlo.'
                            : 'The map is not embedded directly in the demo in order to avoid automatic loading of external services. You can open Google Maps only if you choose to do so.'}
                        </p>
                      </div>
                      <a
                        href={buildMapUrl(selectedStation.mapQuery || selectedStation.name)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-fit items-center gap-2 rounded-2xl border border-border/60 bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:shadow-[var(--shadow-subtle)]"
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

      <section className="mt-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-primary/8 px-4 py-2 text-sm font-semibold text-primary">
              <Train weight="fill" size={16} />
              {isItalian ? 'Treni in diretta' : 'Live trains'}
            </div>
            <h2 className="mt-4 text-3xl md:text-4xl font-serif font-bold tracking-[-0.03em] text-foreground">
              {isItalian ? 'Transiberiana adesso, tratto per tratto' : 'Live view, segment by segment'}
            </h2>
            <p className="mt-3 text-base text-muted-foreground max-w-[70ch]">
              {isItalian
                ? 'Dati live da ViaggiaTreno, filtrati sui tratti tra le stazioni principali. Le informazioni possono risultare parziali o temporaneamente assenti.'
                : 'Live data from ViaggiaTreno, filtered by the main station segments. Data can be partial or temporarily unavailable.'}
            </p>
            <div className="mt-4 inline-flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setLiveMode('transiberiana')}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  liveMode === 'transiberiana'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card/70 text-foreground/70 hover:text-foreground'
                }`}
              >
                {isItalian ? 'Linea Transiberiana' : 'Transiberiana line'}
              </button>
              <button
                type="button"
                onClick={() => setLiveMode('demo')}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  liveMode === 'demo'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card/70 text-foreground/70 hover:text-foreground'
                }`}
              >
                {isItalian ? 'Modalita demo (alta frequenza)' : 'Demo mode (high frequency)'}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-[var(--shadow-subtle)] transition-all duration-300 hover:shadow-[var(--shadow-card)]"
          >
            {isItalian ? 'Aggiorna' : 'Refresh'}
            <ArrowRight weight="bold" size={16} />
          </button>
        </div>

        {liveState.status === 'error' ? (
          <div className="rounded-3xl border border-border/60 bg-card/80 p-6 text-sm text-muted-foreground">
            {isItalian
              ? 'Impossibile caricare i dati live in questo momento. Riprova tra qualche minuto.'
              : 'Unable to load live data right now. Please try again later.'}
          </div>
        ) : null}

        {liveState.status === 'partial' ? (
          <div className="mt-3 rounded-3xl border border-border/60 bg-card/80 p-6 text-sm text-muted-foreground">
            {isItalian
              ? 'Dati live parziali: alcune chiamate non sono andate a buon fine.'
              : 'Partial live data: some requests failed.'}
          </div>
        ) : null}

        {debugEnabled ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setDebugOpen((current) => !current)}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            {debugOpen ? (isItalian ? 'Nascondi dettagli tecnici' : 'Hide technical details') : (isItalian ? 'Mostra dettagli tecnici' : 'Show technical details')}
          </button>

          {debugOpen ? (
            <div className="mt-3 rounded-3xl border border-border/60 bg-card/80 p-6 text-xs text-muted-foreground">
              <div className="text-sm font-semibold text-foreground">
                {isItalian ? 'Diagnostica API' : 'API diagnostics'}
              </div>
              <div className="mt-2">
                {isItalian ? 'Base API usata' : 'API base'}: <span className="text-foreground">{resolvedBaseLabel}</span>
              </div>
              <div className="mt-1">
                {isItalian ? 'Protocollo pagina' : 'Page protocol'}: <span className="text-foreground">{isHttpsPage ? 'https' : 'http'}</span>
              </div>
              {isHttpsPage && isHttpBase ? (
                <div className="mt-2 text-amber-500">
                  {isItalian
                    ? 'Attenzione: il browser blocca le chiamate http da una pagina https (mixed content). Serve un proxy https.'
                    : 'Warning: browsers block http calls from https pages (mixed content). A https proxy is required.'}
                </div>
              ) : null}
              <div className="mt-2 text-xs text-muted-foreground">
                {isItalian
                  ? 'Se nei log compare "NetworkError", di solito e un blocco CORS: usa il proxy locale /api/viaggiatreno (vite) o un proxy server-side in produzione.'
                  : 'If logs show "NetworkError", it is usually CORS: use the local /api/viaggiatreno proxy (vite) or a server-side proxy in production.'}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {liveStations.map((station) => (
                  <a
                    key={`debug-${station.name}`}
                    href={`${resolvedBase}/cercaStazione/${encodeURIComponent(station.viaggiaName || station.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-[11px] font-semibold text-foreground/80 hover:text-foreground"
                  >
                    {isItalian ? 'Test' : 'Test'} {station.name}
                  </a>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {debugLogs.length ? (
                  debugLogs.map((log, idx) => (
                    <div key={`${log.label}-${idx}`} className="rounded-2xl border border-border/60 bg-background/70 px-3 py-2">
                      <div className="text-foreground">{log.label}</div>
                      <div className="mt-1 break-all">{log.url}</div>
                      <div className="mt-1">
                        {isItalian ? 'Esito' : 'Result'}: {log.ok ? 'OK' : 'KO'}{' '}
                        {log.status !== null ? `(${log.status})` : ''}
                        {log.error ? ` · ${log.error}` : ''}
                      </div>
                      {log.sample ? (
                        <div className="mt-1 text-[10px] text-muted-foreground break-all">
                          {log.sample}
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-border/60 bg-background/70 px-3 py-2">
                    {isItalian ? 'Nessun log disponibile.' : 'No logs yet.'}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleCopyDebug}
                className="mt-4 inline-flex items-center rounded-2xl border border-border/60 bg-background/70 px-4 py-2 text-[11px] font-semibold text-foreground hover:text-primary"
              >
                {isItalian ? 'Copia diagnostica' : 'Copy diagnostics'}
              </button>
            </div>
          ) : null}
        </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {liveSegments.map((segment, index) => {
            const data = liveState.segments[index];
            const hasTrains = data?.status === 'ok' && data.trains.length;
            const isLoading = liveState.status === 'loading';
            const statusLabel = isLoading
              ? isItalian
                ? 'Aggiorno...'
                : 'Updating...'
              : hasTrains
                ? isItalian
                  ? 'Treni attivi'
                  : 'Trains running'
                : isItalian
                  ? 'Nessun treno'
                  : 'No trains';
            return (
              <div
                key={`${segment.from}-${segment.to}`}
                className={`rounded-3xl border p-6 shadow-[var(--shadow-subtle)] ${
                  liveMode === 'demo'
                    ? 'border-primary/25 bg-gradient-to-br from-primary/8 via-card/80 to-card/70'
                    : 'border-border/60 bg-card/80'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-foreground">
                      {segment.from} → {segment.to}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2 py-1">
                        <NavigationArrow size={12} weight="fill" className="text-primary" />
                        {isItalian ? 'Tratto' : 'Segment'}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2 py-1">
                        {liveMode === 'demo' ? (isItalian ? 'Demo' : 'Demo') : 'Live'}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      hasTrains
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        hasTrains ? 'bg-emerald-500 animate-gentle-pulse' : 'bg-muted-foreground/50'
                      }`}
                    />
                    {statusLabel}
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {data?.status === 'ok' && data.trains.length ? (
                    data.trains.map((train) => (
                      <div
                        key={`${train.number}-${train.departure}`}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-border/60 bg-background/70 px-4 py-3"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-sm font-semibold text-foreground">
                              {train.category ? `${train.category} ` : ''}{train.number}
                            </div>
                            {train.destination ? (
                              <div className="text-xs text-muted-foreground">
                                {isItalian ? 'Direzione' : 'Direction'} {train.destination}
                              </div>
                            ) : null}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {isItalian ? 'Partenza' : 'Departure'} {train.departure}
                            {train.platform ? ` · Binario ${train.platform}` : ''}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              train.delay > 0
                                ? 'bg-amber-500/15 text-amber-600'
                                : 'bg-emerald-500/15 text-emerald-600'
                            }`}
                          >
                            {train.delay > 0
                              ? `${train.delay} min`
                              : isItalian
                                ? 'In orario'
                                : 'On time'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    data?.status === 'missing' ? (
                      <div className="rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
                        {isItalian ? 'Codice stazione non disponibile.' : 'Station code unavailable.'}
                      </div>
                    ) : (
                      <EmptySegmentState segment={segment} data={data} isItalian={isItalian} />
                    )
                  )}
                </div>
                {debugEnabled && debugOpen && data?.debugMatches?.length ? (
                  <div className="mt-4 rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-xs text-muted-foreground">
                    <div className="text-foreground font-semibold">
                      {isItalian ? 'Debug /andamentoTreno (campione)' : 'Debug /andamentoTreno (sample)'}
                    </div>
                    <div className="mt-2 space-y-2">
                      {data.debugMatches.map((item) => (
                        <div key={`debug-${segment.from}-${item.number}`} className="flex flex-col gap-1">
                          <div>
                            {isItalian ? 'Treno' : 'Train'} {item.number} ·{' '}
                            {item.hasStop
                              ? isItalian
                                ? `FERMA a ${segment.to}`
                                : `STOPS at ${segment.to}`
                              : isItalian
                                ? 'non ferma'
                                : 'does not stop'}
                            {item.error ? ` · ${item.error}` : ''}
                          </div>
                          {item.midnightTs ? (
                            <div className="text-[11px] text-muted-foreground">
                              {isItalian ? 'Midnight TS' : 'Midnight TS'}: {item.midnightTs}
                            </div>
                          ) : null}
                          {item.stopsPreview?.length ? (
                            <div className="text-[11px] text-muted-foreground">
                              {isItalian ? 'Prime fermate' : 'First stops'}: {item.stopsPreview.join(', ')}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {liveState.updatedAt ? (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary/60" />
            {isItalian ? 'Ultimo aggiornamento' : 'Last update'}: {liveState.updatedAt.toLocaleTimeString()}
          </div>
        ) : null}
      </section>
    </div>
  );
}
