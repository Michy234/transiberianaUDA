import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MapPin, SealWarning, X } from '@phosphor-icons/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useI18n } from '../i18n/index.jsx';
import ImageCredit from '../components/ImageCredit';
import { useDialogAccessibility } from '../hooks/useDialogAccessibility';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const DEFAULT_STATIONS = [
  {
    id: 1,
    name: 'Sulmona',
    alt: '328m',
    type: 'Partenza',
    desc: "La città dei confetti e di Ovidio. Punto di partenza dell'itinerario storico.",
    photo: '/photos/fermate/sulmona-fermata.webp',
    photoPosition: 'center center',
    notes: {
      it: ['Centro storico', 'Confetti artigianali'],
      en: ['Historic center', 'Artisanal confetti'],
    },
  },
  {
    id: 2,
    name: 'Campo di Giove',
    alt: '1.064m',
    type: 'Sosta',
    desc: 'Ai piedi della Majella, incorniciata da fitti boschi e paesaggi mozzafiato.',
    photo: '/photos/fermate/campo-di-giove.webp',
    photoPosition: 'center center',
    notes: {
      it: ['Boschi della Majella', 'Borgo di pietra'],
      en: ['Majella woods', 'Stone village'],
    },
  },
  {
    id: 3,
    name: 'Palena',
    alt: '1.258m',
    type: 'Punto panoramico',
    desc: 'Stazione isolata nel Quarto Santa Chiara, regno della natura selvaggia.',
    photo: '/photos/fermate/palena.webp',
    photoPosition: 'center center',
    notes: {
      it: ['Sosta fotografica', 'Altopiano selvaggio'],
      en: ['Photo stop', 'Wild plateau'],
    },
  },
  {
    id: 4,
    name: 'Roccaraso',
    alt: '1.268m',
    type: 'Sosta',
    desc: 'La stazione più alta della linea, rinomata per il turismo montano invernale ed estivo.',
    photo: '/photos/fermate/roccaraso.webp',
    photoPosition: 'center center',
    notes: {
      it: ['Alta quota', 'Turismo di montagna'],
      en: ['High altitude', 'Mountain tourism'],
    },
  },
  {
    id: 5,
    name: 'Castel di Sangro',
    alt: '793m',
    type: 'Capolinea',
    desc: "Città dell'acqua e della pesca a mosca, nodo cruciale dell'Alta Valle del Sangro.",
    photo: '/photos/fermate/castel-di-sangro.webp',
    photoPosition: 'center center',
    notes: {
      it: ['Alta Valle del Sangro', 'Acqua e paesaggio'],
      en: ['Upper Sangro Valley', 'Water and landscape'],
    },
  },
];

const DEFAULT_TIMELINE = [
  {
    year: '1888',
    title: 'Inizio della costruzione',
    desc: "Nel 1888 partirono i lavori della Sulmona-Isernia per collegare l'Appennino interno tra Abruzzo e Molise con una nuova direttrice ferroviaria est-ovest.",
    popup: {
      title: 'Cantieri tra montagne e borghi',
      intro:
        'Alla fine dell’Ottocento molti centri dell’Appennino centrale erano difficili da raggiungere e il trasporto di persone o merci richiedeva tempi lunghi e percorsi impervi.',
      paragraphs: [
        'Lo Stato italiano scelse quindi di costruire una ferrovia interna tra Sulmona e Isernia, indipendente dalle linee costiere e capace di collegare borghi come Palena, Rivisondoli e Pescocostanzo con un asse est-ovest stabile.',
        'Il progetto era molto complesso: bisognava mantenere pendenze accettabili, evitare curve troppo strette e restare vicini ai centri abitati, intervenendo con scavi, murature, ponti e viadotti su terreni spesso instabili.',
        'Gli operai lavorarono in condizioni estreme, con metri di neve in inverno e caldo intenso d’estate, trasformando la linea in uno dei più grandi esempi di ingegneria ferroviaria appenninica.',
      ],
      highlights: ['128 km di tracciato originario', '59 gallerie', 'ponti e viadotti lungo tutta la tratta'],
    },
    reverse: false,
    image: '/photos/journey/1888-inizio-costruzione.webp',
    imageAlt: "Locomotiva storica in stazione, immagine d'epoca che richiama i primi anni della linea Sulmona-Isernia",
    stepId: 'storia-1888',
  },
  {
    year: '1897',
    title: 'Inaugurazione della linea',
    desc: 'Il 18 settembre 1897 la Transiberiana d’Abruzzo fu inaugurata con un treno celebrativo, diventando subito un collegamento decisivo per persone, merci e comunità montane.',
    popup: {
      title: 'Il giorno che cambiò la linea',
      intro:
        'L’inaugurazione ufficiale avvenne il 18 settembre 1897 con un treno celebrativo partito da Castellammare Adriatico e diretto a Napoli attraverso l’intera tratta montana.',
      paragraphs: [
        'L’evento coinvolse autorità, tecnici, operai e cittadini: il treno venne percepito come simbolo di progresso, modernità e apertura dei paesi di montagna verso il resto d’Italia.',
        'Il valico di Rivisondoli-Pescocostanzo raggiungeva 1268,82 metri sul livello del mare, record della rete a scartamento ordinario italiana per molti anni.',
        'Nei primi anni l’intera tratta Sulmona-Isernia richiedeva circa 5 ore e 55 minuti, tempo che nel 1938 scese a 3 ore e 33 minuti grazie a convogli più efficienti e migliorie infrastrutturali.',
      ],
      highlights: ['18 settembre 1897', '1268,82 m al valico di Rivisondoli-Pescocostanzo', '5h 55m nei primi anni di esercizio'],
    },
    reverse: true,
    image: '/photos/journey/1897-inaugurazione.webp',
    imageAlt: 'Cartolina storica della stazione di Palena negli anni di apertura della Transiberiana d’Abruzzo',
    stepId: 'storia-1897',
  },
  {
    year: "Anni '40",
    title: 'Guerra e distruzione',
    desc: 'Durante la Seconda guerra mondiale la linea fu gravemente danneggiata lungo la Linea Gustav, con ponti, viadotti e binari distrutti durante la ritirata tedesca.',
    popup: {
      title: 'La ferrovia sulla Linea Gustav',
      intro:
        'Nel cuore della guerra la Transiberiana d’Abruzzo aveva un forte valore strategico, perché attraversava l’Appennino lontano dalle principali direttrici costiere.',
      paragraphs: [
        'Nel novembre 1943, durante la ritirata tedesca, vennero distrutti ponti e viadotti, minati interi segmenti della linea e danneggiati numerosi binari per bloccare gli spostamenti alleati.',
        'Paesi come Palena, Rivisondoli e Castel di Sangro rimasero isolati mentre anche il territorio circostante subiva bombardamenti e pesanti difficoltà logistiche.',
        'La ricostruzione fu lenta: il tratto Sulmona-Castel di Sangro tornò operativo nel 1955, mentre la riapertura completa fino a Isernia arrivò soltanto il 9 novembre 1960.',
      ],
      highlights: ['novembre 1943: distruzioni belliche', '1955: riapertura Sulmona-Castel di Sangro', '9 novembre 1960: piena riattivazione'],
    },
    reverse: false,
    image: '/photos/journey/anni-40-guerra.webp',
    imageAlt: 'Locomotiva tra strutture ferroviarie distrutte durante la Seconda guerra mondiale',
    stepId: 'storia-anni-40',
  },
  {
    year: "Anni '60-'80",
    title: 'Trasformazione e declino',
    desc: 'Nel dopoguerra la linea continuò a servire passeggeri e merci, ma automobili, autobus e spopolamento dei borghi la resero progressivamente meno centrale.',
    popup: {
      title: 'Tra modernizzazione e perdita di centralità',
      intro:
        'Dopo la ricostruzione, la linea visse ancora una fase intensa, con servizi passeggeri, convogli merci e un ruolo importante per la vita economica delle montagne.',
      paragraphs: [
        'I treni merci continuarono a trasportare bestiame e greggi, sostituendo in parte la transumanza tradizionale e mantenendo attivo un legame diretto con il Tavoliere delle Puglie.',
        'Negli stessi anni le automotrici diesel ALn 668 ridussero sensibilmente i tempi di percorrenza e le relazioni Pescara-Napoli arrivarono a circa 2 ore e 47 minuti.',
        'L’espansione delle auto private, il miglioramento delle strade e il calo demografico dei borghi montani ridussero però il traffico ferroviario, preparando il declino che divenne evidente negli anni Novanta.',
      ],
      highlights: ['treni merci per greggi e bestiame', 'ALn 668 in servizio', 'Pescara-Napoli in circa 2h 47m'],
    },
    reverse: true,
    image: '/photos/journey/anni-60-80-declino.webp',
    imageAlt: 'Automotrice ALn in sosta a Castel di Sangro nel 1976, simbolo della fase di trasformazione della linea',
    stepId: 'storia-anni-60-80',
  },
  {
    year: '2011',
    title: 'Sospensione della linea',
    desc: 'Tra ottobre 2010 e dicembre 2011 furono sospesi prima il tratto Castel di Sangro-Carpinone e poi Sulmona-Castel di Sangro, fermando il servizio regolare.',
    popup: {
      title: 'La fine del servizio ordinario',
      intro:
        'La sospensione arrivò al termine di un lungo indebolimento del servizio, causato da pochi passeggeri, costi alti e minori investimenti nel trasporto ferroviario locale.',
      paragraphs: [
        'Nell’ottobre 2010 fu fermato il traffico tra Castel di Sangro e Carpinone; nel dicembre 2011 si arrestò anche l’ultimo tratto operativo tra Sulmona e Castel di Sangro.',
        'Fino ad allora la linea era ancora usata da treni locali e interregionali, in alcuni casi classificati come Espresso Pescara-Napoli, con percorrenze di circa cinque ore.',
        'La chiusura provocò forte rammarico tra residenti e appassionati, ma proprio da quel momento nacque la mobilitazione che avrebbe portato alla rinascita turistica della ferrovia.',
      ],
      highlights: ['ottobre 2010: stop Castel di Sangro-Carpinone', 'dicembre 2011: stop Sulmona-Castel di Sangro', 'mobilitazione guidata anche da Le Rotaie'],
    },
    reverse: false,
    image: '/photos/journey/2011-sospensione.webp',
    imageAlt: 'Binari della linea storica immersi nella valle, immagine che richiama il periodo di sospensione del servizio',
    stepId: 'storia-2011',
  },
  {
    year: '2014',
    title: 'Rinascita turistica',
    desc: "Dopo il successo dei primi treni storici promossi da Le Rotaie, il 17 maggio 2014 la linea rinacque come ferrovia turistica con il progetto 'Binari Senza Tempo' di Fondazione FS.",
    popup: {
      title: 'Dalla salvezza dal basso alla Ferrovia dei Parchi',
      intro:
        'Dopo la sospensione nacque subito una mobilitazione dal basso: associazioni, appassionati e territori locali videro nella linea una straordinaria vocazione turistica.',
      paragraphs: [
        'Il primo treno storico sperimentale partì il 4 marzo 2012 grazie all’associazione Le Rotaie e registrò un successo di pubblico immediato, favorito anche dai paesaggi innevati degli altipiani.',
        'La svolta definitiva arrivò il 17 maggio 2014 con il progetto Binari Senza Tempo di Fondazione FS Italiane, che destinò la Sulmona-Isernia all’uso turistico e culturale.',
        'Nel 2017 la legge 128/2017 la riconobbe ufficialmente come ferrovia turistica italiana; più recentemente interventi sostenuti anche dal PNRR hanno migliorato binari, ponti e stazioni preservandone il fascino storico.',
      ],
      highlights: ['4 marzo 2012: primo treno storico', '17 maggio 2014: progetto Binari Senza Tempo', '2017: riconoscimento come ferrovia turistica'],
    },
    reverse: true,
    image: '/photos/journey/2014-rinascita-turistica.webp',
    imageAlt: 'Treno turistico sulla Ferrovia dei Parchi tra boschi e montagne appenniniche',
    stepId: 'storia-2014',
  },
];

function isReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getNavOffset() {
  if (typeof window === 'undefined') return 0;
  const nav = document.querySelector('nav');
  return nav ? nav.offsetHeight + 8 : 0;
}

function scrollPopupIntoView(element) {
  if (typeof window === 'undefined' || !element) return;

  const rect = element.getBoundingClientRect();
  const topOffset = getNavOffset() + 24;
  const bottomMargin = 24;
  const availableHeight = window.innerHeight - topOffset - bottomMargin;
  const currentTop = window.scrollY;

  let targetTop = currentTop;

  if (rect.height <= availableHeight) {
    targetTop = currentTop + rect.top - topOffset;
  } else if (rect.top < topOffset) {
    targetTop = currentTop + rect.top - topOffset;
  } else if (rect.bottom > window.innerHeight - bottomMargin) {
    targetTop = currentTop + rect.bottom - (window.innerHeight - bottomMargin);
  }

  if (Math.abs(targetTop - currentTop) < 8) return;

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: isReducedMotion() ? 'auto' : 'smooth',
  });
}

function TimelineItem({
  year,
  title,
  desc,
  popup,
  reverse,
  image,
  imageAlt,
  stepId,
  reduceMotion,
  moreInfoLabel,
  lessInfoLabel,
  popupLabel,
  onPopupToggle,
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef(null);
  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const popupDialogId = `${stepId}-popup-dialog`;
  const popupHeadingId = `${stepId}-popup-title`;
  const popupIntroId = `${stepId}-popup-intro`;

  const closePopup = () => {
    setIsPopupOpen(false);
    if (onPopupToggle) onPopupToggle(stepId, false);
  };

  useDialogAccessibility({
    isOpen: isPopupOpen,
    containerRef: popupRef,
    initialFocusRef: closeButtonRef,
    returnFocusRef: triggerRef,
    onClose: closePopup,
    lockScroll: false,
  });

  useEffect(() => {
    if (!isPopupOpen) return undefined;

    const handlePointerDown = (event) => {
      const target = event.target;
      if (popupRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      closePopup();
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isPopupOpen]);

  useEffect(() => {
    if (!isPopupOpen) return undefined;
    if (typeof window === 'undefined') return undefined;

    const rafId = window.requestAnimationFrame(() => {
      scrollPopupIntoView(popupRef.current);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [isPopupOpen]);

  const textMotion = reduceMotion
    ? { initial: false, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0 } }
    : {
      initial: { opacity: 0, x: reverse ? 50 : -50 },
      whileInView: { opacity: 1, x: 0 },
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    };

  const imageMotion = reduceMotion
    ? { initial: false, whileInView: { opacity: 1, scale: 1 }, transition: { duration: 0 } }
    : {
      initial: { opacity: 0, scale: 0.9 },
      whileInView: { opacity: 1, scale: 1 },
      transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.2 },
    };

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between w-full mb-24 gap-8 ${reverse ? 'md:flex-row-reverse' : ''}`}
      data-journey-step={stepId}
    >
      <motion.div 
        initial={textMotion.initial}
        whileInView={textMotion.whileInView}
        viewport={{ once: true, margin: "-100px" }}
        transition={textMotion.transition}
        className="relative w-full md:w-5/12"
      >
        <div className="text-primary font-serif text-3xl font-bold mb-4 italic">{year}</div>
        <h3 className="text-3xl font-bold tracking-tight mb-4 text-foreground">{title}</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">{desc}</p>
        {popup ? (
          <>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => {
                setIsPopupOpen((current) => {
                  const next = !current;
                  if (onPopupToggle) onPopupToggle(stepId, next);
                  return next;
                });
              }}
              aria-expanded={isPopupOpen}
              aria-controls={popupDialogId}
              aria-haspopup="dialog"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary transition-colors duration-300 hover:bg-primary/12"
            >
              {isPopupOpen ? lessInfoLabel : moreInfoLabel}
              <ArrowRight
                weight="bold"
                size={14}
                className={`transition-transform duration-300 ${isPopupOpen ? 'rotate-90' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isPopupOpen ? (
                <motion.div
                  ref={popupRef}
                  id={popupDialogId}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="absolute left-0 top-full z-30 mt-4 w-full max-w-[32rem] rounded-[28px] border border-border/60 bg-card/95 p-5 shadow-[var(--shadow-elevated)] backdrop-blur-xl"
                  role="dialog"
                  aria-labelledby={popupHeadingId}
                  aria-describedby={popupIntroId}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                        {popupLabel}
                      </p>
                      <h4 id={popupHeadingId} className="mt-2 text-2xl font-serif font-bold tracking-tight text-foreground">
                        {popup.title}
                      </h4>
                    </div>

                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={closePopup}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground transition-colors duration-200 hover:bg-background"
                      aria-label={lessInfoLabel}
                    >
                      <X size={16} weight="bold" />
                    </button>
                  </div>

                  <p id={popupIntroId} className="mt-4 text-sm leading-relaxed text-foreground/85">{popup.intro}</p>

                  <div className="mt-4 space-y-3">
                    {popup.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                </motion.div>
              ) : null}
            </AnimatePresence>
          </>
        ) : null}
      </motion.div>
      
      <div className="w-12 h-12 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center shrink-0 z-10 hidden md:flex shadow-[var(--shadow-subtle)]">
         <div className="w-3 h-3 rounded-full bg-primary" />
      </div>
      
      <motion.div 
        initial={imageMotion.initial}
        whileInView={imageMotion.whileInView}
        viewport={{ once: true, margin: "-100px" }}
        transition={imageMotion.transition}
        className="relative w-full aspect-[4/3] rounded-3xl bg-secondary shadow-[var(--shadow-card)] md:w-5/12"
      >
        <div className="rounded-media-frame relative h-full w-full" style={{ '--media-radius': '1.5rem' }}>
          <img 
            src={image}
            alt={imageAlt || `${title} - ${year}`} 
            className="rounded-media-content h-full w-full object-cover hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <ImageCredit
            src={image}
            className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1 text-[10px] text-white/90"
            linkClassName="text-white/90 hover:text-white"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function Journey() {
  const { t, tm, lang } = useI18n();
  const isItalian = lang === 'it';
  const journeyRootRef = useRef(null);
  const snapTriggerRef = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [activePopupId, setActivePopupId] = useState(null);
  const stationDefaultsById = Object.fromEntries(DEFAULT_STATIONS.map((station) => [station.id, station]));
  const stations = tm('journey.stations', DEFAULT_STATIONS).map((station, index) => {
    const fallbackStation = stationDefaultsById[station.id] || DEFAULT_STATIONS[index] || {};
    return { ...fallbackStation, ...station };
  });
  const timeline = tm('journey.timeline', DEFAULT_TIMELINE).map((item, index) => ({
    ...item,
    image:
      item.image ||
      [
        '/photos/journey/1888-inizio-costruzione.webp',
        '/photos/journey/1897-inaugurazione.webp',
        '/photos/journey/anni-40-guerra.webp',
        '/photos/journey/anni-60-80-declino.webp',
        '/photos/journey/2011-sospensione.webp',
        '/photos/journey/2014-rinascita-turistica.webp',
      ][index] ||
      '/photos/storia/transiberiana.webp',
  }));
  const moreInfoLabel = isItalian ? 'Più info' : 'More info';
  const lessInfoLabel = isItalian ? 'Chiudi' : 'Close';
  const popupLabel = isItalian ? 'Approfondimento' : 'Details';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    update();
    if (media.addEventListener) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const root = journeyRootRef.current;
    if (!root) return;
    if (reduceMotion) return;

    let updateSnapPoints = () => {};

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray(root.querySelectorAll('[data-journey-step]'));
      if (!steps.length) return;

      let snapPoints = [];
      const isNarrow = window.matchMedia('(max-width: 640px)').matches;
      const snapDuration = isNarrow ? { min: 0.15, max: 0.35 } : { min: 0.2, max: 0.5 };
      const snapDelay = isNarrow ? 0.18 : 0.1;

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        snap: {
          snapTo: (value) => (snapPoints.length ? gsap.utils.snap(snapPoints, value) : value),
          duration: snapDuration,
          delay: snapDelay,
          ease: 'power2.out',
        },
      });
      snapTriggerRef.current = trigger;

      updateSnapPoints = () => {
        const start = trigger.start;
        const end = trigger.end;
        const total = Math.max(1, end - start);
        const offset = getNavOffset();
        snapPoints = steps.map((step) => {
          const top = step.getBoundingClientRect().top + window.scrollY - offset;
          return gsap.utils.clamp(0, 1, (top - start) / total);
        });
      };

      ScrollTrigger.addEventListener('refresh', updateSnapPoints);
      updateSnapPoints();

      gsap.utils.toArray(root.querySelectorAll('[data-journey-fade]')).forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
            },
          },
        );
      });
    }, root);

    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('load', handleLoad);
      ScrollTrigger.removeEventListener('refresh', updateSnapPoints);
      ctx.revert();
    };
  }, [reduceMotion]);

  useEffect(() => {
    const trigger = snapTriggerRef.current;
    if (!trigger) return;
    if (activePopupId) {
      trigger.disable(false);
      return;
    }
    trigger.enable();
    ScrollTrigger.refresh();
  }, [activePopupId]);

  const introMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const introTextMotion = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, transition: { duration: 0 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.2 } };

  return (
    <div className="min-h-[100dvh] bg-background relative selection:bg-primary/20" ref={journeyRootRef}>
      <section
        className="pt-40 pb-20 px-6 max-w-4xl mx-auto text-center"
        data-journey-step="storia-intro"
      >
        <motion.h1 
          initial={introMotion.initial}
          animate={introMotion.animate}
          transition={introMotion.transition}
          className="text-5xl md:text-7xl font-serif font-bold tracking-[-0.03em] mb-8 text-foreground"
        >
          {t('journey.hero.title.lead', 'Un secolo di')} <span className="italic text-primary/70">{t('journey.hero.title.accent', 'storia')}</span> {t('journey.hero.title.tail', 'attraverso gli Appennini')}
        </motion.h1>
        <motion.p 
          initial={introTextMotion.initial}
          animate={introTextMotion.animate}
          transition={introTextMotion.transition}
          className="text-xl text-muted-foreground leading-relaxed max-w-[60ch] mx-auto"
        >
          {t(
            'journey.hero.subtitle',
            "Nata come grande sfida ferroviaria di montagna, la Sulmona-Isernia fu inaugurata il 18 settembre 1897 e dal 17 maggio 2014 è tornata a vivere come una delle linee turistiche più iconiche d'Italia.",
          )}
        </motion.p>
      </section>

      <section className="py-24 px-6 max-w-6xl mx-auto relative">
        <div className="absolute top-0 bottom-0 left-6 md:left-1/2 w-0.5 bg-border -translate-x-1/2 hidden md:block" aria-hidden="true" />

        {timeline.map((item) => (
          <TimelineItem
            key={item.stepId}
            year={item.year}
            title={item.title}
            desc={item.desc}
            popup={item.popup}
            reverse={item.reverse}
            image={item.image}
            imageAlt={item.imageAlt}
            stepId={item.stepId}
            reduceMotion={reduceMotion}
            moreInfoLabel={moreInfoLabel}
            lessInfoLabel={lessInfoLabel}
            popupLabel={popupLabel}
            onPopupToggle={(id, isOpen) => setActivePopupId(isOpen ? id : null)}
          />
        ))}
      </section>

      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16" data-journey-step="fermate-intro">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/8 text-primary font-semibold text-sm mb-6">
            {t('journey.stops.badge', 'Le fermate')}
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-[-0.03em] mb-6 text-foreground">
            {t('journey.stops.title', 'Le stazioni lungo il viaggio')}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-[60ch] mx-auto">
            {t(
              'journey.stops.subtitle',
              'Dopo la storia, il percorso prosegue tra borghi e altopiani: ogni fermata è una tappa da vivere con calma.',
            )}
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {stations.map((station) => (
            <article
              key={station.id}
              data-journey-step={`fermata-${station.id}`}
              data-journey-fade
              className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-8 shadow-[var(--shadow-elevated)] md:p-12"
            >
              <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] lg:items-center">
                <div className="lg:pr-6">
                  <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/75">
                    {isItalian ? 'Tappa' : 'Stop'} {String(station.id).padStart(2, '0')}
                  </div>
                  <h3 className="mb-4 text-3xl font-serif font-bold tracking-tight text-foreground md:text-4xl">
                    {station.name}
                  </h3>
                  <div className="mb-5 h-px w-20 bg-border/70" aria-hidden="true" />
                  <p className="max-w-[34ch] text-lg leading-relaxed text-muted-foreground">
                    {station.desc}
                  </p>

                  {station.notes?.[lang] || station.notes?.it ? (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {(station.notes?.[lang] || station.notes?.it).map((note) => (
                        <div
                          key={`${station.id}-${note}`}
                          className="inline-flex items-center gap-2 rounded-2xl border border-border/50 bg-secondary/65 px-4 py-2 text-sm text-foreground/85 shadow-[var(--shadow-subtle)]"
                        >
                          <span className="h-2 w-2 rounded-full bg-primary/70" aria-hidden="true" />
                          {note}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>

                {station.photo ? (
                  <div className="relative">
                    <div className="relative aspect-[4/3] rounded-[1.75rem] border border-border/50 bg-secondary/60 shadow-[var(--shadow-card)]">
                      <div className="rounded-media-frame relative h-full w-full" style={{ '--media-radius': '1.75rem' }}>
                        <img
                          src={station.photo}
                          alt={isItalian ? `Veduta di ${station.name}` : `View of ${station.name}`}
                          className="rounded-media-content h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          style={{ objectPosition: station.photoPosition || 'center center' }}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" aria-hidden="true" />
                        <div className="absolute bottom-4 left-4">
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/22 px-3 py-1.5 text-[13px] font-medium text-white/88 shadow-[var(--shadow-subtle)] backdrop-blur-sm">
                            <span className="h-2 w-2 rounded-full bg-primary/85" aria-hidden="true" />
                            {station.type} · {station.alt}
                          </div>
                        </div>
                        <ImageCredit
                          src={station.photo}
                          className="absolute right-3 top-3 rounded-full bg-black/45 px-3 py-1 text-[10px] text-white/90 backdrop-blur-sm"
                          linkClassName="text-white/90 hover:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-32 px-6">
        <div
          className="max-w-5xl mx-auto"
          data-journey-step="cta"
          data-journey-fade
        >
          <div className="bg-card rounded-3xl p-10 md:p-12 shadow-[var(--shadow-elevated)] border border-border/40">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/8 text-primary font-semibold text-sm mb-6">
                  {t('journey.cta.badge', 'Ultima tappa')}
                </div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-[-0.03em] mb-4 text-foreground">
                  {t('journey.cta.title', 'Compra il biglietto')}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-[50ch]">
                  {isItalian
                    ? 'Modulo dimostrativo non attivo. In questa versione non vengono raccolti indirizzi email e non è possibile inviare richieste o prenotazioni.'
                    : 'Demonstration form not active. This version does not collect emails and cannot be used to send requests or bookings.'}
                </p>
              </div>

              <form className="w-full lg:max-w-sm" noValidate>
                <div className="rounded-2xl border border-primary/20 bg-primary/8 px-4 py-3 text-sm leading-relaxed text-foreground/80">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full bg-primary/12 p-1.5 text-primary">
                      <SealWarning size={16} weight="fill" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {isItalian ? 'Demo non conforme per la raccolta di contatti' : 'Demo not intended for contact collection'}
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        {isItalian
                          ? 'Per questa demo il modulo resta visibile solo come riferimento grafico, ma è disattivato e non deve essere usato.'
                          : 'In this demo the form remains visible only as a visual placeholder, but it is disabled and must not be used.'}
                      </p>
                    </div>
                  </div>
                </div>
                <label htmlFor="journey-email" className="text-sm font-semibold text-muted-foreground">
                  {t('journey.form.label', 'Email')}
                </label>
                <input
                  id="journey-email"
                  name="email"
                  type="email"
                  disabled
                  value=""
                  aria-disabled="true"
                  className="mt-2 w-full cursor-not-allowed rounded-2xl border border-border/60 bg-background/60 px-4 py-3 text-foreground/65 placeholder:text-muted-foreground/70 opacity-75"
                  placeholder={isItalian ? 'demo non attiva' : 'demo inactive'}
                />
                <button
                  type="submit"
                  disabled
                  aria-disabled="true"
                  className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-primary/45 px-6 py-3 font-semibold text-primary-foreground/85 opacity-80"
                >
                  {isItalian ? 'Modulo non utilizzabile' : 'Form unavailable'}
                  <ArrowRight weight="bold" size={18} />
                </button>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {isItalian
                    ? 'Prima di un eventuale uso reale questa sezione dovrà essere sostituita con un flusso conforme e con i contatti ufficiali del titolare.'
                    : 'Before any real use, this section must be replaced with a compliant flow and official controller contacts.'}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
