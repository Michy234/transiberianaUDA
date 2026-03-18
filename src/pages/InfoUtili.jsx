import React, { startTransition, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowSquareOut,
  CalendarBlank,
  CaretDown,
  Clock,
  Devices,
  EnvelopeSimple,
  Leaf,
  MapPin,
  Snowflake,
  Sparkle,
  Sun,
  Ticket,
  Train,
  Warning,
  Wheelchair,
} from '@phosphor-icons/react';
import { useI18n } from '../i18n/index.jsx';

const TRIPADVISOR_URL =
  'https://www.tripadvisor.it/Attraction_Review-g194928-d12914784-Reviews-Transiberiana_d_Italia-Sulmona_Province_of_L_Aquila_Abruzzo.html';
const FERROVIA_DEI_PARCHI_URL = 'https://www.ferroviadeiparchi.it';
const ACCESSIBILITY_EMAIL = 'mailto:info@ferroviadeiparchi.it';

const DEFAULT_OVERVIEW = [
  { id: 'departure', label: 'Partenza', value: 'Sulmona, binario 1' },
  { id: 'duration', label: 'Durata', value: 'Gita in giornata' },
  { id: 'altitude', label: 'Quota massima', value: '1.268 m' },
  { id: 'tickets', label: 'Biglietti', value: 'Online, posti limitati' },
];

const DEFAULT_CHECKLIST = [
  'Arriva in stazione almeno 30 minuti prima della partenza.',
  'Vestiti a strati: il treno è caldo, le soste in quota molto meno.',
  "Porta acqua e snack: non c'è un vagone ristorante.",
  'Prenota con largo anticipo nei periodi più richiesti.',
];

const DEFAULT_SEASON_HIGHLIGHTS = [
  { id: 'winter', label: 'Inverno', description: 'Neve, mercatini e atmosfera da alta quota.' },
  { id: 'autumn', label: 'Autunno', description: 'Foliage e luce perfetta per fotografie e borghi.' },
  { id: 'springSummer', label: 'Primavera e estate', description: "Escursioni, bici, picnic e soste all'aperto." },
];

const DEFAULT_CATEGORIES = [
  {
    id: 'planning',
    label: 'Pianifica',
    description: 'Percorso, tempi, biglietti e come arrivare pronti in stazione.',
  },
  {
    id: 'onboard',
    label: 'A bordo',
    description: 'Comfort, servizi essenziali e cosa aspettarsi dalle carrozze storiche.',
  },
  {
    id: 'accessibility',
    label: 'Accessibilità',
    description: 'Mobilità ridotta, passeggini, animali e richieste da fare prima di prenotare.',
  },
];

const DEFAULT_RULES = [
  'Non sporgerti dai finestrini mentre il treno è in movimento.',
  'Non lasciare rifiuti a bordo o lungo la linea.',
  'Tratta con cura legno, velluti e dettagli originali delle carrozze storiche.',
];

const DEFAULT_ARRIVAL_TIPS = [
  'La partenza avviene quasi sempre dalla stazione di Sulmona, in genere dal binario 1.',
  "Vicino all'ingresso della stazione c'è un parcheggio comodo, con altri posti auto lungo il viale.",
  "Se arrivi con treni regionali da lontano, considera l'opzione di arrivare la sera prima.",
];

const DEFAULT_FAQ = [
  {
    id: 'name',
    category: 'planning',
    tag: 'Origine',
    q: 'Perché si chiama Transiberiana?',
    a: 'Il nome nasce dagli altipiani abruzzesi che in inverno, tra neve e vento, ricordano paesaggi siberiani. Oggi è uno dei soprannomi più celebri del turismo ferroviario italiano.',
  },
  {
    id: 'route',
    category: 'planning',
    tag: 'Percorso',
    q: "Qual è l'itinerario?",
    a: 'Si parte quasi sempre da Sulmona e si sale tra Majella e Appennino con fermate che cambiano in base alla stagione e al tema del viaggio, spesso tra Campo di Giove, Palena, Roccaraso e Castel di Sangro.',
  },
  {
    id: 'duration',
    category: 'planning',
    tag: 'Tempi',
    q: 'Quanto dura il viaggio?',
    a: "Di solito è un'escursione in giornata: partenza al mattino, rientro nel tardo pomeriggio e soste lunghe nei borghi per visitare, mangiare o partecipare agli eventi locali.",
  },
  {
    id: 'best-period',
    category: 'planning',
    tag: 'Stagioni',
    q: 'Quando rende di più?',
    a: "In inverno per neve e mercatini, in autunno per il foliage, in primavera ed estate per trekking, bici e uscite all'aperto. Non c'è una stagione migliore in assoluto: cambia il tipo di esperienza.",
  },
  {
    id: 'tickets',
    category: 'planning',
    tag: 'Prenotazione',
    q: 'Dove si comprano i biglietti?',
    a: 'Online sul sito ufficiale o tramite partner. Nei periodi più richiesti i posti finiscono in fretta, quindi conviene monitorare le aperture e prenotare presto.',
  },
  {
    id: 'station',
    category: 'planning',
    tag: 'Partenza',
    q: "Dove si parte e dove lascio l'auto?",
    a: "La base di partenza è la stazione FS di Sulmona. A pochi passi dall'ingresso trovi un parcheggio pratico e vale la pena arrivare con anticipo per sistemarti senza fretta.",
  },
  {
    id: 'carriages',
    category: 'onboard',
    tag: 'Carrozze',
    q: "Com'è fatto il treno?",
    a: "Si viaggia su convogli storici degli anni 20 e 30, con interni originali, porte manuali e finestrini apribili. Non troverai Wi-Fi o prese: l'esperienza punta proprio sull'atmosfera d'epoca.",
  },
  {
    id: 'winter-temperature',
    category: 'onboard',
    tag: 'Comfort',
    q: 'È presente il riscaldamento in inverno?',
    a: 'Sì, le carrozze sono riscaldate. Il punto critico non è il viaggio ma le soste in montagna, quindi servono strati termici, scarpe adatte e una giacca seria.',
  },
  {
    id: 'food',
    category: 'onboard',
    tag: 'Pranzo',
    q: 'Si mangia sul treno?',
    a: "Non c'è un vagone ristorante. Puoi portare acqua e snack, mentre per il pranzo ci si organizza durante le soste, al sacco, nei mercatini oppure prenotando un ristorante nei paesi.",
  },
  {
    id: 'photos',
    category: 'onboard',
    tag: 'Esperienza',
    q: 'È adatto a chi ama fare foto?',
    a: 'Sì, è una delle ragioni per cui molti lo scelgono. I paesaggi sono il cuore del viaggio, ma scatta sempre in sicurezza e senza sporgerti durante la marcia.',
  },
  {
    id: 'mobility',
    category: 'accessibility',
    tag: 'Mobilità',
    q: 'Se ho difficoltà motorie può essere un problema?',
    a: 'Potrebbe. Le carrozze storiche hanno ingressi stretti, scalini ripidi e servizi non progettati per le esigenze di accessibilità moderne, quindi va verificato tutto prima di prenotare.',
  },
  {
    id: 'wheelchair',
    category: 'accessibility',
    tag: 'Sedia a rotelle',
    q: 'Posso viaggiare con la sedia a rotelle?',
    a: 'Se è pieghevole può essere caricata nel carro bagagliaio, ci si può dotare di una carrozzina leggera (permette il passaggio in varchi stretti), ma se serve una postazione accessibile durante il viaggio bisogna chiedere in anticipo se è prevista una carrozza attrezzata.',
  },
  {
    id: 'stroller',
    category: 'accessibility',
    tag: 'Passeggini',
    q: 'Passeggini e carrozzine sono gestibili?',
    a: 'Sì, ma non possono restare aperti nei corridoi. Vanno richiusi e sistemati, e nei borghi spesso risultano più pratici marsupio o fascia rispetto alle ruote.',
  },
  {
    id: 'pets',
    category: 'accessibility',
    tag: 'Animali',
    q: 'Posso portare il cane?',
    a: 'I cani di piccola taglia sono generalmente ammessi se tenuti in trasportino o in braccio. I cani guida sono sempre ammessi; per gli altri casi conviene confermare le condizioni prima della prenotazione.',
  },
];

const DEFAULT_DECALOGUES = [
  {
    id: 'environment',
    eyebrow: 'Educazione civica',
    title: 'Decalogo ambientale',
    body:
      'Dieci azioni concrete che collegano casa, territorio e comunità: sostenibilità quotidiana, rispetto dei parchi e responsabilità verso chi verrà dopo.',
    groups: [
      {
        id: 'daily-life',
        title: 'Azioni quotidiane e stile di vita',
        items: [
          {
            id: '3r',
            number: 1,
            title: 'Le 3 R: riduci, riusa, ricicla',
            body:
              "Produci meno rifiuti, riutilizza quello che puoi e fai bene la raccolta differenziata. Elettrodomestici e batterie vanno sempre portati all'isola ecologica.",
          },
          {
            id: 'single-use',
            number: 2,
            title: "Stop all'usa e getta e spiagge pulite",
            body:
              'Preferisci borracce e borse di tela. Al mare porta via i tuoi rifiuti e usa un posacenere portatile: i mozziconi inquinano l’acqua e danneggiano i pesci.',
          },
          {
            id: 'home-savings',
            number: 3,
            title: 'Risparmia acqua ed energia in casa',
            body:
              'Spegni le luci, usa LED, non alzare troppo il riscaldamento e chiudi il rubinetto quando non serve. Mai versare olio fritto o vernici nel lavandino.',
          },
          {
            id: 'mobility',
            number: 4,
            title: 'Muoviti in modo intelligente',
            body:
              "Vai più spesso a piedi, in bici o con i mezzi pubblici: usare meno l'auto significa aria più pulita per tutti.",
          },
          {
            id: 'local-food',
            number: 5,
            title: 'Compra cibo locale e di stagione',
            body:
              'Scegli prodotti del territorio per ridurre i trasporti e considera di mangiare meno carne: aiuta a risparmiare acqua e a inquinare meno.',
          },
        ],
      },
      {
        id: 'future',
        title: 'Territorio, comunità e futuro',
        items: [
          {
            id: 'buy-less',
            number: 6,
            title: 'Compra solo ciò che serve',
            body:
              'Vestiti e oggetti hanno un costo ambientale. Compra solo il necessario, meglio se usato, ed evita gli imballaggi in plastica superflui.',
          },
          {
            id: 'parks',
            number: 7,
            title: 'Rispetta la natura selvaggia e i parchi',
            body:
              'Nei Parchi Nazionali resta sui sentieri, non lasciare rifiuti e non fare rumori forti o usare droni che disturbano la fauna.',
          },
          {
            id: 'future-mindset',
            number: 8,
            title: 'Pensa al futuro',
            body:
              'Non basta evitare i danni: dobbiamo anche prenderci cura della natura per lasciarla in salute a chi verrà dopo di noi.',
          },
          {
            id: 'take-action',
            number: 9,
            title: 'Fai la tua parte e fai sentire la tua voce',
            body:
              'Se vedi rifiuti o inquinamento, segnalalo alle autorità. Quando puoi, partecipa alle giornate di pulizia di spiagge e parchi.',
          },
          {
            id: 'guardian',
            number: 10,
            title: 'Sii un custode, non un padrone',
            body:
              'Il vero progresso è vivere in armonia con la Terra, rispettandone gli equilibri invece di pensare di poterla dominare.',
          },
        ],
      },
    ],
  },
  {
    id: 'digital',
    eyebrow: 'Cittadinanza digitale',
    title: 'Decalogo per la sostenibilità digitale',
    body:
      "Tecnologia e ambiente si toccano più di quanto sembri: hardware, energia, stampa, dati e abitudini online possono essere gestiti in modo più leggero e consapevole.",
    groups: [
      {
        id: 'hardware',
        title: 'Hardware e dispositivi fisici',
        items: [
          {
            id: 'raee',
            number: 1,
            title: 'Ricicla e smaltisci correttamente i dispositivi elettronici',
            body:
              "I RAEE contengono materiali preziosi ma anche sostanze tossiche: portali alle isole ecologiche o nei negozi che ritirano l'usato, mai nell'indifferenziata.",
          },
          {
            id: 'use-longer',
            number: 2,
            title: 'Usa a lungo i tuoi dispositivi',
            body:
              "La parte più impattante di smartphone e PC è la produzione. Prima di sostituirli, prova a ripararli e resisti alla corsa all'ultimo modello.",
          },
          {
            id: 'switch-off',
            number: 3,
            title: 'Spegni ciò che non usi',
            body:
              'Stand-by e caricabatterie lasciati collegati consumano energia. Spegni il computer se resta fermo a lungo e stacca ciò che non serve.',
          },
          {
            id: 'efficient-devices',
            number: 4,
            title: 'Scegli dispositivi efficienti e sostenibili',
            body:
              'Quando devi comprare davvero, controlla l’efficienza energetica e valuta i ricondizionati: allungano la vita dei prodotti ed evitano nuova produzione.',
          },
          {
            id: 'printing',
            number: 5,
            title: 'Stai attento a cosa stampi e quanto stampi',
            body:
              'Stampa solo quando serve davvero. Se devi farlo, usa fronte-retro, riduci i margini e preferisci il bianco e nero.',
          },
        ],
      },
      {
        id: 'awareness',
        title: 'Etica, consapevolezza e benessere digitale',
        items: [
          {
            id: 'eco-search',
            number: 6,
            title: 'Scegli motori di ricerca ecologici',
            body:
              'Esistono alternative come Ecosia che destinano parte dei profitti a riforestazione o energie rinnovabili.',
          },
          {
            id: 'doomscrolling',
            number: 7,
            title: 'Limita il doomscrolling',
            body:
              "Scorrere i social senza fine consuma tempo, dati ed energia. Un po' di detox digitale fa bene sia a te sia all'ambiente.",
          },
          {
            id: 'bookmarks',
            number: 8,
            title: 'Segna i siti tra i preferiti',
            body:
              'Se torni spesso sugli stessi siti, salvali nei segnalibri: eviti ricerche ripetute e traffico dati inutile.',
          },
          {
            id: 'ai-use',
            number: 9,
            title: "Fai attenzione all'uso dell'Intelligenza Artificiale",
            body:
              "Generare testi o immagini con l'IA richiede molta potenza di calcolo. Usala per compiti che la giustificano, non per richieste banali.",
          },
          {
            id: 'spread-awareness',
            number: 10,
            title: 'Sensibilizza gli altri',
            body:
              "L'inquinamento digitale è poco visibile: condividere queste buone pratiche in classe, in famiglia e con gli amici moltiplica l'impatto positivo.",
          },
        ],
      },
    ],
  },
];

const overviewIcons = {
  departure: MapPin,
  duration: Clock,
  altitude: Sparkle,
  tickets: Ticket,
};

const seasonIcons = {
  winter: Snowflake,
  autumn: Leaf,
  springSummer: Sun,
};

const decalogueIcons = {
  environment: Leaf,
  digital: Devices,
};

const categoryIcons = {
  planning: CalendarBlank,
  onboard: Train,
  accessibility: Wheelchair,
};

function getMotionTransition(reduceMotion, extra = {}) {
  if (reduceMotion) {
    return { duration: 0, ...extra };
  }
  return { type: 'spring', stiffness: 150, damping: 24, ...extra };
}

function OverviewCard({ item }) {
  const Icon = overviewIcons[item.id] || Sparkle;

  return (
    <div className="rounded-[24px] border border-primary/18 bg-[linear-gradient(135deg,rgba(107,158,126,0.92),rgba(168,213,186,0.78))] p-4 text-white shadow-[var(--shadow-card)] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/16 text-white shadow-[var(--shadow-subtle)]">
          <Icon size={18} weight="duotone" />
        </span>
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/72">{item.label}</span>
          <span className="mt-1 block text-sm font-semibold leading-tight text-white/95">{item.value}</span>
        </span>
      </div>
    </div>
  );
}

function SeasonCard({ item }) {
  const Icon = seasonIcons[item.id] || Sparkle;

  return (
    <div className="rounded-[24px] border border-primary/12 bg-card/85 dark:bg-card/65 p-4 shadow-[var(--shadow-subtle)]">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/14 text-primary shadow-[var(--shadow-subtle)]">
          <Icon size={18} weight="duotone" />
        </span>
        <div>
          <h3 className="text-sm font-bold text-foreground">{item.label}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

function SidePanel({ title, eyebrow, icon: Icon, children, className = '' }) {
  return (
    <div className={`rounded-[28px] border border-primary/10 bg-card/85 dark:bg-card/65 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl ${className}`.trim()}>
      <div className="flex items-start gap-4">
        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/12 text-primary shadow-[var(--shadow-subtle)]">
          <Icon size={20} weight="duotone" />
        </span>
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <div className="inline-flex rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80">{eyebrow}</div>
          ) : null}
          <h2 className="mt-2 text-2xl font-serif font-bold tracking-tight text-foreground">{title}</h2>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

function DecaloguePanel({ decalogue }) {
  const Icon = decalogueIcons[decalogue.id] || Sparkle;

  return (
    <SidePanel eyebrow={decalogue.eyebrow} title={decalogue.title} icon={Icon} className="h-full">
      <p className="text-sm leading-relaxed text-muted-foreground">{decalogue.body}</p>

      <div className="mt-5 space-y-5">
        {decalogue.groups.map((group) => (
          <section key={group.id}>
            <div className="inline-flex rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/80">
              {group.title}
            </div>

            <ol className="mt-3 list-none space-y-3 p-0">
              {group.items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-[24px] border border-primary/8 bg-card/85 dark:bg-card/65 px-4 py-4 shadow-[var(--shadow-subtle)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/10 bg-primary/12 text-sm font-semibold text-primary shadow-[var(--shadow-subtle)]">
                      {String(item.number).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold leading-snug text-foreground md:text-[15px]">{item.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </SidePanel>
  );
}

function CategoryButton({ category, count, isActive, onClick }) {
  const Icon = categoryIcons[category.id] || Sparkle;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`info-panel-${category.id}`}
      id={`info-tab-${category.id}`}
      onClick={onClick}
      className={`group rounded-[24px] border px-4 py-4 text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isActive
        ? 'border-primary/28 bg-primary/90 text-primary-foreground shadow-[var(--shadow-card)]'
        : 'border-primary/12 bg-card/85 dark:bg-card/60 text-foreground/88 shadow-[var(--shadow-subtle)] hover:border-primary/24 hover:shadow-[var(--shadow-card)]'
        }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300 ${isActive ? 'bg-primary-foreground/14 text-primary-foreground' : 'border border-primary/10 bg-primary/14 text-primary'
            }`}
        >
          <Icon size={18} weight={isActive ? 'fill' : 'duotone'} />
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${isActive ? 'bg-primary-foreground/14 text-primary-foreground/90' : 'bg-primary/12 text-primary/80'
            }`}
        >
          {count}
        </span>
      </div>
      <div className="mt-4">
        <div className="text-sm font-bold">{category.label}</div>
        <p className={`mt-1 text-sm leading-relaxed ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {category.description}
        </p>
      </div>
    </button>
  );
}

function FaqItem({ item, isOpen, onToggle, reduceMotion }) {
  return (
    <article
      className={`rounded-[28px] border transition-all duration-300 ${isOpen
        ? 'border-primary/22 bg-card/85 dark:bg-card/70 shadow-[var(--shadow-card)]'
        : 'border-primary/10 bg-card/80 dark:bg-card/60 shadow-[var(--shadow-subtle)] hover:border-primary/18 hover:bg-card/85 dark:hover:bg-card/70'
        }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 p-6 text-left"
        aria-expanded={isOpen}
      >
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-[linear-gradient(135deg,rgba(107,158,126,0.10),rgba(212,165,116,0.16))] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/80">
            {item.tag}
          </span>
          <h3 className="mt-3 text-lg font-bold tracking-tight text-foreground md:text-xl">{item.q}</h3>
        </div>
        <span
          className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 ${isOpen ? 'border-primary/25 bg-primary/14 text-primary' : 'border-primary/12 bg-primary/6 text-primary/72'
            }`}
          aria-hidden="true"
        >
          <CaretDown size={18} className={isOpen ? 'rotate-180' : ''} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={reduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduceMotion ? { opacity: 0, height: 0 } : { opacity: 0, height: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <p className="border-t border-border/60 pt-5 text-sm leading-relaxed text-muted-foreground md:text-base">{item.a}</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

export default function InfoUtili() {
  const reduceMotion = useReducedMotion();
  const { t, tm } = useI18n();

  const overview = tm('info.overview', DEFAULT_OVERVIEW);
  const checklist = tm('info.checklist', DEFAULT_CHECKLIST);
  const seasonHighlights = tm('info.seasonHighlights', DEFAULT_SEASON_HIGHLIGHTS);
  const categories = tm('info.categories', DEFAULT_CATEGORIES);
  const rules = tm('info.rules.items', DEFAULT_RULES);
  const arrivalTips = tm('info.arrival.tips', DEFAULT_ARRIVAL_TIPS);
  const faq = tm('info.faq', DEFAULT_FAQ);
  const decalogues = tm('info.decalogues', DEFAULT_DECALOGUES);

  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? 'planning');
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    if (!categories.some((category) => category.id === activeCategory) && categories[0]) {
      setActiveCategory(categories[0].id);
    }
  }, [activeCategory, categories]);

  const faqCounts = useMemo(
    () =>
      faq.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] ?? 0) + 1;
        return acc;
      }, {}),
    [faq],
  );

  const filteredFaq = useMemo(
    () => faq.filter((item) => item.category === activeCategory),
    [activeCategory, faq],
  );

  useEffect(() => {
    if (!filteredFaq.some((item) => item.id === expandedFaq)) {
      setExpandedFaq(filteredFaq[0]?.id ?? null);
    }
  }, [expandedFaq, filteredFaq]);

  const activeCategoryData = categories.find((category) => category.id === activeCategory) || categories[0];

  return (
    <div className="min-h-[100dvh] px-6 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-[1400px]">
        <section className="relative overflow-hidden rounded-[36px] border border-border/60 bg-card/70 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(107,158,126,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(212,165,116,0.18),transparent_38%)]" />
          <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-primary/12 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-20 left-0 h-64 w-64 rounded-full bg-accent-warm/18 blur-3xl" aria-hidden="true" />

          <div className="relative grid gap-8 p-8 md:p-10 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] xl:p-12">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getMotionTransition(reduceMotion)}
            >
              <div className="inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkle size={16} weight="fill" />
                {t('info.badge', 'Prima di salire a bordo')}
              </div>

              <h1 className="mt-6 text-5xl font-serif font-bold tracking-[-0.03em] text-foreground md:text-7xl">
                {t('info.title.lead', 'Info')} <span className="text-primary italic">{t('info.title.accent', 'utili')}</span>
              </h1>

              <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-foreground/82 md:text-xl">
                {t(
                  'info.subtitle',
                  'Una guida pratica per capire come si parte, cosa aspettarsi a bordo e quali dettagli conviene verificare prima di prenotare.',
                )}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={FERROVIA_DEI_PARCHI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,rgba(107,158,126,0.98),rgba(132,177,121,0.92))] px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-button)] transition-all duration-300 hover:scale-[1.01] hover:brightness-105 active:scale-[0.99]"
                  aria-label={t('info.bookingAria', 'Apri il sito ufficiale per calendario e biglietti in una nuova scheda')}
                >
                  <Ticket size={18} weight="fill" />
                  {t('info.actions.booking', 'Calendario e biglietti')}
                  <ArrowSquareOut size={17} aria-hidden="true" />
                </a>

                <a
                  href={TRIPADVISOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/14 bg-card/85 dark:bg-card/60 px-5 py-3.5 text-sm font-semibold text-foreground shadow-[var(--shadow-subtle)] transition-all duration-300 hover:border-primary/28 hover:shadow-[var(--shadow-card)]"
                  aria-label={t('info.tripadvisorAria', 'Apri le recensioni su TripAdvisor in una nuova scheda')}
                >
                  <Sparkle size={18} weight="fill" className="text-[#00AA6C]" />
                  {t('info.actions.tripadvisor', 'Recensioni TripAdvisor')}
                  <ArrowSquareOut size={17} aria-hidden="true" />
                </a>
              </div>

                <a
                  href={ACCESSIBILITY_EMAIL}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-2 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary/12 hover:text-foreground"
                  aria-label={t('info.accessibilityAria', 'Scrivi per richiedere supporto su accessibilità e assistenza')}
              >
                <EnvelopeSimple size={17} className="text-primary" />
                {t('info.actions.accessibility', 'Richiedi supporto per accessibilità')}
              </a>

              <div
                className="mt-8 grid gap-3 sm:grid-cols-2 xl:max-w-3xl"
                aria-label={t('info.overviewAria', 'Riepilogo rapido del viaggio')}
              >
                {overview.map((item) => (
                  <OverviewCard key={item.id} item={item} />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getMotionTransition(reduceMotion, { delay: 0.06 })}
              className="rounded-[32px] border border-border/60 bg-card/78 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-accent-warm/30 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-wood">
                <Warning size={14} weight="fill" />
                {t('info.quickGuide.eyebrow', 'Checklist rapida')}
              </div>
              <h2 className="mt-4 text-3xl font-serif font-bold tracking-tight text-foreground">
                {t('info.quickGuide.title', 'Prima di partire')}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {t(
                  'info.quickGuide.body',
                  'Il viaggio è facile da godersi se arrivi preparato: poche verifiche giuste evitano problemi il giorno della partenza.',
                )}
              </p>

              <div className="mt-6 space-y-3">
                {checklist.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-primary/10 bg-card/85 dark:bg-card/65 px-4 py-3">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-foreground/85">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {t('info.seasonHighlightsTitle', 'Quando rende di più')}
                </h3>
                <div className="mt-4 grid gap-3">
                  {seasonHighlights.map((item) => (
                    <SeasonCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.22fr)]">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getMotionTransition(reduceMotion, { delay: 0.08 })}
            className="space-y-6"
          >
            <SidePanel
              eyebrow={t('info.rules.eyebrow', 'Buone pratiche')}
              title={t('info.rules.title', 'Regole a bordo')}
              icon={Warning}
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(
                  'info.rules.body',
                  'Un treno storico va vissuto con più attenzione di un convoglio moderno: pochi accorgimenti aiutano tutti a godersi il viaggio meglio.',
                )}
              </p>
              <div className="mt-4 space-y-3">
                {rules.map((rule) => (
                  <div key={rule} className="rounded-2xl border border-primary/8 bg-card/85 dark:bg-card/65 px-4 py-3 text-sm leading-relaxed text-foreground/82">
                    {rule}
                  </div>
                ))}
              </div>
            </SidePanel>

            <SidePanel
              eyebrow={t('info.arrival.eyebrow', 'Logistica')}
              title={t('info.arrival.title', 'Arrivare a Sulmona')}
              icon={MapPin}
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(
                  'info.arrival.body',
                  'La partenza è pensata per chi arriva presto: sapere dove andare e come muoversi riduce molto lo stress della mattina.',
                )}
              </p>
              <div className="mt-4 space-y-3">
                {arrivalTips.map((tip) => (
                  <div key={tip} className="rounded-2xl border border-primary/8 bg-card/85 dark:bg-card/65 px-4 py-3 text-sm leading-relaxed text-foreground/85">
                    {tip}
                  </div>
                ))}
              </div>
            </SidePanel>

            <SidePanel
              eyebrow={t('info.support.eyebrow', 'Da verificare prima')}
              title={t('info.support.title', 'Accessibilità e assistenza')}
              icon={Wheelchair}
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(
                  'info.support.body',
                  'Per sedia a rotelle, deambulazione limitata o esigenze particolari non conviene improvvisare: meglio chiedere conferma prima di acquistare il biglietto.',
                )}
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row xl:flex-col">
                <a
                  href={ACCESSIBILITY_EMAIL}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/14 bg-card/85 dark:bg-card/60 px-4 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary/26 hover:shadow-[var(--shadow-subtle)]"
                >
                  <EnvelopeSimple size={17} weight="fill" className="text-primary" />
                  {t('info.support.mailLabel', 'Scrivi a info@ferroviadeiparchi.it')}
                </a>
                <a
                  href={FERROVIA_DEI_PARCHI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/18 bg-card/85 dark:bg-card/60 px-4 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary/30 hover:brightness-105"
                >
                  <Ticket size={17} weight="fill" />
                  {t('info.support.siteLabel', 'Controlla sito e disponibilità')}
                </a>
              </div>
            </SidePanel>
          </motion.div>

          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={getMotionTransition(reduceMotion, { delay: 0.12 })}
            className="rounded-[32px] border border-border/60 bg-card/80 p-6 shadow-[var(--shadow-elevated)] backdrop-blur-xl md:p-8"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                  <Train size={14} weight="fill" />
                  {t('info.faqEyebrow', 'Domande essenziali')}
                </div>
                <h2 className="mt-4 text-3xl font-serif font-bold tracking-tight text-foreground">
                  {t('info.faqTitle', 'Info pratiche, senza perdere tempo')}
                </h2>
                <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-muted-foreground md:text-base">
                  {t(
                    'info.faqSubtitle',
                    'Le risposte essenziali sono organizzate per argomento, così trovi subito ciò che ti serve prima della partenza.',
                  )}
                </p>
              </div>
              {activeCategoryData ? (
                <p className="max-w-[32ch] text-sm leading-relaxed text-muted-foreground">
                  {activeCategoryData.description}
                </p>
              ) : null}
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3" role="tablist" aria-label={t('info.categoryAria', 'Filtra le informazioni per argomento')}>
              {categories.map((category) => (
                <CategoryButton
                  key={category.id}
                  category={category}
                  count={faqCounts[category.id] ?? 0}
                  isActive={category.id === activeCategory}
                  onClick={() => {
                    startTransition(() => {
                      setActiveCategory(category.id);
                    });
                  }}
                />
              ))}
            </div>

            <div
              id={`info-panel-${activeCategory}`}
              role="tabpanel"
              aria-labelledby={`info-tab-${activeCategory}`}
              className="mt-8 space-y-4"
              aria-label={t('info.faqAria', 'Domande frequenti della pagina informazioni utili')}
            >
              {filteredFaq.length > 0 ? (
                filteredFaq.map((item) => (
                  <FaqItem
                    key={item.id}
                    item={item}
                    isOpen={item.id === expandedFaq}
                    onToggle={() => setExpandedFaq((current) => (current === item.id ? null : item.id))}
                    reduceMotion={reduceMotion}
                  />
                ))
              ) : (
                <div className="rounded-[28px] border border-dashed border-border/70 bg-background/60 px-5 py-8 text-center text-sm text-muted-foreground">
                  {t('info.faqEmpty', 'Nessuna informazione disponibile per questa categoria.')}
                </div>
              )}
            </div>
          </motion.section>
        </div>

        <section className="mt-14 md:mt-16" aria-label="Separatore sezione decaloghi">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(107,158,126,0),rgba(107,158,126,0.22),rgba(107,158,126,0))]" aria-hidden="true" />
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-card/85 dark:bg-card/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/82 shadow-[var(--shadow-subtle)]">
              <Leaf size={14} weight="duotone" />
              Decaloghi di cittadinanza
              <Devices size={14} weight="duotone" />
            </div>
              <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(107,158,126,0),rgba(107,158,126,0.22),rgba(107,158,126,0))]" aria-hidden="true" />
          </div>

          <p className="mx-auto mt-4 max-w-[58ch] text-center text-sm leading-relaxed text-muted-foreground">
            Due finestre dedicate a sostenibilità ambientale e digitale, separate dal blocco pratico della pagina.
          </p>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          {decalogues.map((decalogue, index) => (
            <motion.div
              key={decalogue.id}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={getMotionTransition(reduceMotion, { delay: 0.14 + index * 0.04 })}
            >
              <DecaloguePanel decalogue={decalogue} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
