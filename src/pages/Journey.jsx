import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, SealWarning } from '@phosphor-icons/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useI18n } from '../i18n/index.jsx';
import ImageCredit from '../components/ImageCredit';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const DEFAULT_STATIONS = [
  { id: 1, name: 'Sulmona', alt: '328m', type: 'Partenza', desc: "La città dei confetti e di Ovidio. Punto di partenza dell'itinerario storico." },
  { id: 2, name: 'Campo di Giove', alt: '1.064m', type: 'Sosta', desc: 'Ai piedi della Majella, incorniciata da fitti boschi e paesaggi mozzafiato.' },
  { id: 3, name: 'Palena', alt: '1.258m', type: 'Punto panoramico', desc: 'Stazione isolata nel Quarto Santa Chiara, regno della natura selvaggia.' },
  { id: 4, name: 'Roccaraso', alt: '1.268m', type: 'Sosta', desc: 'La stazione più alta della linea, rinomata per il turismo montano invernale ed estivo.' },
  { id: 5, name: 'Castel di Sangro', alt: '793m', type: 'Capolinea', desc: "Città dell'acqua e della pesca a mosca, nodo cruciale dell'Alta Valle del Sangro." }
];

const DEFAULT_TIMELINE = [
  {
    year: '1892',
    title: "L'inizio dei lavori",
    desc: "Iniziano i lavori per la costruzione della Sulmona-Isernia. La sfida ingegneristica è colossale: bisogna superare dislivelli enormi scavando gallerie nella roccia viva dell'Appennino.",
    reverse: false,
    imageId: '1474487548417-781cb71495f3',
    stepId: 'storia-1892',
  },
  {
    year: '1897',
    title: "L'inaugurazione",
    desc: "Viene inaugurato il tratto fino a Cansano e Campo di Giove. La ferrovia diventa subito il principale mezzo di trasporto per merci e persone tra l'Abruzzo e il Molise.",
    reverse: true,
    imageId: '1506260408121-e353d10b87c7',
    stepId: 'storia-1897',
  },
  {
    year: '1943',
    title: 'Distruzione e rinascita',
    desc: "Durante la Seconda Guerra Mondiale la linea subisce gravissimi danni a causa della Linea Gustav. Negli anni '50 viene ricostruita e ammodernata, riprendendo il suo ruolo di collante vitale.",
    reverse: false,
    imageId: '1475924156734-496f6cac6ec1',
    stepId: 'storia-1943',
  },
  {
    year: '2011',
    title: 'La sospensione',
    desc: "Il servizio ordinario passeggeri viene sospeso per via degli elevati costi di gestione. Si teme l'abbandono definitivo della linea storica.",
    reverse: true,
    imageId: '1465146344425-f00d5f5c8f07',
    stepId: 'storia-2011',
  },
  {
    year: 'Oggi',
    title: 'La Transiberiana',
    desc: "Rinata come ferrovia turistica grazie alla Fondazione FS Italiane, oggi offre l'esperienza magica di viaggiare su treni d'epoca attraverso i paesaggi immacolati dell'Appennino.",
    reverse: false,
    imageId: '1494515843206-f3117d3f51b7',
    stepId: 'storia-oggi',
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

function TimelineItem({ year, title, desc, reverse, image, stepId, reduceMotion }) {
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
        className="w-full md:w-5/12"
      >
        <div className="text-primary font-serif text-3xl font-bold mb-4 italic">{year}</div>
        <h3 className="text-3xl font-bold tracking-tight mb-4 text-foreground">{title}</h3>
        <p className="text-lg text-muted-foreground leading-relaxed">{desc}</p>
      </motion.div>
      
      <div className="w-12 h-12 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center shrink-0 z-10 hidden md:flex shadow-[var(--shadow-subtle)]">
         <div className="w-3 h-3 rounded-full bg-primary" />
      </div>
      
      <motion.div 
        initial={imageMotion.initial}
        whileInView={imageMotion.whileInView}
        viewport={{ once: true, margin: "-100px" }}
        transition={imageMotion.transition}
        className="w-full md:w-5/12 aspect-[4/3] rounded-3xl bg-secondary overflow-hidden shadow-[var(--shadow-card)] relative"
      >
         <img 
           src={image}
           alt={`${title} - ${year}`} 
           className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
           loading="lazy"
         />
         <ImageCredit
           src={image}
           className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1 text-[10px] text-white/90"
           linkClassName="text-white/90 hover:text-white"
         />
      </motion.div>
    </div>
  );
}

export default function Journey() {
  const { t, tm, lang } = useI18n();
  const isItalian = lang === 'it';
  const journeyRootRef = useRef(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const stations = tm('journey.stations', DEFAULT_STATIONS);
  const timeline = tm('journey.timeline', DEFAULT_TIMELINE).map((item, index) => ({
    ...item,
    image:
      item.image ||
      [
        '/photos/storia/sulmona.webp',
        '/photos/storia/campo-di-giove.webp',
        '/photos/storia/palena.webp',
        '/photos/storia/roccaraso.webp',
        '/photos/storia/transiberiana.webp',
      ][index] ||
      '/photos/storia/transiberiana.webp',
  }));

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
      const snapDuration = isNarrow ? { min: 0.1, max: 0.2 } : { min: 0.12, max: 0.32 };
      const snapDelay = isNarrow ? 0.12 : 0.05;

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        snap: {
          snapTo: (value) => (snapPoints.length ? gsap.utils.snap(snapPoints, value) : value),
          duration: snapDuration,
          delay: snapDelay,
          ease: 'power1.out',
        },
      });

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
            "Progettata a fine Ottocento, la ferrovia Sulmona-Isernia è un capolavoro di ingegneria civile che ha unito le popolazioni montane prima di diventare la linea turistica più iconica d'Italia.",
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
            reverse={item.reverse}
            image={item.image}
            stepId={item.stepId}
            reduceMotion={reduceMotion}
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
              className="bg-card rounded-3xl p-8 md:p-12 shadow-[var(--shadow-elevated)] border border-border/40"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/8 text-primary font-semibold text-sm mb-6">
                  <MapPin weight="fill" size={16} />
                  {station.type} · {station.alt}
              </div>
              <h3 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-4 text-foreground">
                {station.name}
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-[60ch]">
                {station.desc}
              </p>
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
                    ? 'Modulo dimostrativo non attivo. In questa versione non vengono raccolte email e non e possibile inviare richieste o prenotazioni.'
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
                        {isItalian ? 'Demo non conforme per raccolta contatti' : 'Demo not compliant for contact collection'}
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        {isItalian
                          ? 'Per questa demo il modulo resta visibile solo come riferimento grafico, ma e disattivato e non deve essere usato.'
                          : 'In this demo the form remains visible only as a visual reference, but it is disabled and must not be used.'}
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
                    ? 'Prima di un eventuale uso reale questa sezione dovra essere sostituita con un flusso conforme e con contatti ufficiali del titolare.'
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
