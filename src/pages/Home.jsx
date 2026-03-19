import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, CloudRain, MapPin, Tree } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Journey from './Journey';
import { useI18n } from '../i18n/index.jsx';
import ImageCredit from '../components/ImageCredit';
import SectionErrorBoundary from '../components/SectionErrorBoundary';
import homeSouvenirPhoto from '../assets/photohome/WhatsApp Image 2026-03-16 at 12.26.50 PM.jpeg';
import homeSulmonaPhoto from '../assets/photohome/WhatsApp Image 2026-03-16 at 12.26.51 PM.jpeg';
import homeTrainStopPhoto from '../assets/photohome/WhatsApp Image 2026-03-16 at 12.38.29 PM.jpeg';

gsap.registerPlugin(ScrollToPlugin);

const HERO_SLIDES = [
  {
    src: '/photos/storia/transiberiana.webp',
    creditSrc: '/photos/storia/transiberiana.webp',
    altKey: 'home.heroImageAlt',
    altFallback: 'Treno storico che attraversa un viadotto immerso nella vegetazione delle montagne abruzzesi',
    labelKey: 'home.hero.slideLabelViaduct',
    labelFallback: 'Viadotto storico',
    objectPosition: 'center center',
  },
  {
    src: homeTrainStopPhoto,
    altKey: 'home.heroImageAltStation',
    altFallback: 'Passeggeri accanto al treno storico fermo nella stazione di Campo di Giove',
    labelKey: 'home.hero.slideLabelStation',
    labelFallback: 'Campo di Giove',
    objectPosition: 'center center',
  },
  {
    src: homeSulmonaPhoto,
    altKey: 'home.heroImageAltSulmona',
    altFallback: 'Statua monumentale e campanili nel centro storico di Sulmona sotto un cielo limpido',
    labelKey: 'home.hero.slideLabelSulmona',
    labelFallback: 'Sulmona',
    objectPosition: 'center 32%',
  },
  {
    src: homeSouvenirPhoto,
    altKey: 'home.heroImageAltSouvenir',
    altFallback: "Souvenir artigianali colorati esposti su un banco di legno lungo il percorso della Transiberiana d'Abruzzo",
    labelKey: 'home.hero.slideLabelSouvenir',
    labelFallback: 'Artigianato locale',
    objectPosition: 'center center',
  },
];

const HERO_SLIDE_INTERVAL = 15000;

function getNavOffset() {
  if (typeof window === 'undefined') return 0;
  const nav = document.querySelector('nav');
  return nav ? nav.offsetHeight + 8 : 0;
}

export default function Home() {
  const journeyRef = useRef(null);
  const heroFrameRef = useRef(null);
  const slideImageRefs = useRef([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const { t, lang } = useI18n();
  const reducedMotion = useReducedMotion();
  const isItalian = lang === 'it';
  const heroSlides = HERO_SLIDES.map((slide) => ({
    ...slide,
    alt: t(slide.altKey, slide.altFallback),
  }));

  useEffect(() => {
    if (heroSlides.length <= 1) return undefined;

    const intervalId = window.setInterval(() => {
      setActiveSlideIndex((currentIndex) => (currentIndex + 1) % heroSlides.length);
    }, HERO_SLIDE_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, [heroSlides.length]);

  useEffect(() => {
    slideImageRefs.current.forEach((image) => {
      if (image) {
        gsap.set(image, { x: 0, y: 0 });
      }
    });

    if (heroFrameRef.current) {
      gsap.set(heroFrameRef.current, { scale: 1, rotateX: 0, rotateY: 0 });
    }
  }, [activeSlideIndex]);

  const handleSlideChange = (direction) => {
    setActiveSlideIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;
      return (nextIndex + heroSlides.length) % heroSlides.length;
    });
  };

  const handleHeroMove = (event) => {
    if (reducedMotion) return;

    const frame = heroFrameRef.current;
    const activeImage = slideImageRefs.current[activeSlideIndex];
    if (!frame || !activeImage) return;

    const rect = frame.getBoundingClientRect();
    const xProgress = (event.clientX - rect.left) / rect.width - 0.5;
    const yProgress = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(frame, {
      scale: 1,
      rotateY: xProgress * 5,
      rotateX: -yProgress * 5,
      duration: 0.35,
      ease: 'power3.out',
      transformPerspective: 900,
      transformOrigin: 'center center',
    });

    gsap.to(activeImage, {
      x: xProgress * 18,
      y: yProgress * 14,
      duration: 0.5,
      ease: 'power3.out',
    });
  };

  const resetHeroMotion = () => {
    const frame = heroFrameRef.current;
    const activeImage = slideImageRefs.current[activeSlideIndex];

    if (frame) {
      gsap.to(frame, {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        duration: 0.45,
        ease: 'power3.out',
      });
    }

    if (activeImage) {
      gsap.to(activeImage, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
  };

  const handleStartJourney = () => {
    const target = journeyRef.current;
    if (!target || typeof window === 'undefined') return;

    const offset = getNavOffset();
    if (reducedMotion) {
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'auto' });
      return;
    }

    gsap.to(window, {
      duration: 0.9,
      scrollTo: { y: target, offsetY: offset },
      ease: 'power2.out',
    });
  };

  return (
    <div className="w-full relative overflow-hidden bg-background">
      {/* Asymmetric Hero */}
      <section className="min-h-[100dvh] w-full flex flex-col lg:flex-row relative">
        {/* Left Content (55%) */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-0 lg:pt-32 pb-16 z-10 relative order-2 lg:order-1 -mt-6 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.2 }}
            className="max-w-xl"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/8 text-primary text-sm font-semibold tracking-tight mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-gentle-pulse" aria-hidden="true"></span>
              {t('home.badge', 'Prossima partenza: {{city}}', { city: 'Sulmona' })}
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-[-0.03em] leading-[1.08] text-foreground mb-8">
              {t('home.title.lead', 'La')}{' '}
              <span className="text-primary italic">{t('home.title.brand', 'Transiberiana')}</span> <br />
              {t('home.title.tail', "d'Abruzzo")}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[50ch] mb-10">
              {t(
                'home.subtitle',
                "Un'esperienza autentica a bordo di carrozze d'epoca. Attraversa i Parchi Nazionali e i borghi più belli dell'Appennino Centrale.",
              )}
            </p>

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 90, damping: 18 }}
              className="mb-8 bg-card/85 backdrop-blur-xl p-5 rounded-2xl shadow-[var(--shadow-card)] border border-border/40 lg:hidden"
            >
              <div className="grid grid-cols-3 gap-4 text-foreground">
                <div>
                  <div className="text-muted-foreground text-xs font-semibold mb-1" style={{ fontVariant: 'small-caps' }}>Altitudine max</div>
                  <div className="text-xl font-bold flex items-center gap-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <Tree weight="fill" className="text-primary" size={18} />
                    1.268m
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-semibold mb-1" style={{ fontVariant: 'small-caps' }}>Meteo live</div>
                  <div className="text-xl font-bold flex items-center gap-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <CloudRain weight="fill" className="text-primary-light" size={18} />
                    8°C
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-semibold mb-1" style={{ fontVariant: 'small-caps' }}>Fermate</div>
                  <div className="text-xl font-bold flex items-center gap-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <MapPin weight="fill" className="text-wood" size={18} />
                    21
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button 
                type="button"
                onClick={handleStartJourney}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[var(--shadow-button)]"
              >
                {t('home.cta.start', 'Inizia il viaggio')}
                <ArrowRight weight="bold" size={18} />
              </button>
              <Link 
                to="/fermate" 
                className="px-8 py-4 bg-card text-foreground rounded-2xl font-semibold flex items-center justify-center hover:shadow-[var(--shadow-card)] transition-all duration-300 border border-border/60"
              >
                {t('home.cta.itinerary', "Scopri l'itinerario")}
              </Link>
            </div>
            <div className="mt-[1.75rem] flex items-start gap-2 text-sm text-muted-foreground">
              <span className="relative top-1 inline-flex text-primary animate-journey-arrow motion-reduce:animate-none" aria-hidden="true">
                <ArrowDown size={16} />
              </span>
              <span>{t('home.scrollHint', 'Scorri per iniziare il viaggio')}</span>
            </div>
          </motion.div>
        </div>

        {/* Right Image (45%) with overlap */}
        <div className="w-full lg:w-[45%] min-h-[64vh] sm:min-h-[52vh] lg:min-h-0 relative px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 lg:pt-28 pb-2 sm:pb-4 md:pb-6 lg:pb-8 flex items-center justify-center order-1 lg:order-2">
          <motion.div 
            ref={heroFrameRef}
            onMouseMove={handleHeroMove}
            onMouseLeave={resetHeroMotion}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="group w-full h-[clamp(500px,66vh,840px)] sm:h-[clamp(580px,70vh,900px)] lg:h-[min(82vh,880px)] max-w-[620px] lg:max-w-[720px] xl:max-w-[800px] 2xl:max-w-[860px] relative rounded-3xl overflow-hidden shadow-[var(--shadow-elevated)] lg:-ml-8"
          >
            <div className="absolute inset-0">
              {heroSlides.map((slide, index) => {
                const isActive = index === activeSlideIndex;
                return (
                  <motion.img
                    key={slide.src}
                    ref={(node) => {
                      slideImageRefs.current[index] = node;
                    }}
                    src={slide.src}
                    alt={isActive ? slide.alt : ''}
                    aria-hidden={!isActive}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ objectPosition: slide.objectPosition }}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 1.06,
                    }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : {
                            opacity: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
                            scale: { duration: HERO_SLIDE_INTERVAL / 1000, ease: 'linear' },
                          }
                    }
                  />
                );
              })}
            </div>
            <div className="absolute inset-y-0 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={() => handleSlideChange(-1)}
                className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white/90 opacity-100 backdrop-blur-sm transition-all duration-300 hover:bg-black/50 hover:text-white focus-visible:ring-2 focus-visible:ring-white/80 md:translate-x-[-8px] md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100"
                aria-label={t('home.hero.previousSlide', 'Immagine precedente')}
              >
                <ArrowLeft size={18} weight="bold" />
              </button>
              <button
                type="button"
                onClick={() => handleSlideChange(1)}
                className="pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/35 text-white/90 opacity-100 backdrop-blur-sm transition-all duration-300 hover:bg-black/50 hover:text-white focus-visible:ring-2 focus-visible:ring-white/80 md:translate-x-[8px] md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100"
                aria-label={t('home.hero.nextSlide', 'Immagine successiva')}
              >
                <ArrowRight size={18} weight="bold" />
              </button>
            </div>
            <ImageCredit
              src={heroSlides[activeSlideIndex]?.creditSrc || heroSlides[activeSlideIndex]?.src}
              className="absolute top-4 right-4 z-20 rounded-full bg-black/45 px-3 py-1 text-[10px] text-white/90"
              linkClassName="text-white/90 hover:text-white"
            />

            {/* Warm Floating Stats Card (desktop) */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 100, damping: 20 }}
              className="hidden lg:block absolute bottom-6 left-6 right-6 z-20 bg-card/90 backdrop-blur-lg p-5 rounded-2xl shadow-[var(--shadow-card)] border border-border/40"
            >
              <div className="grid grid-cols-3 gap-4 text-foreground">
                <div>
                  <div className="text-muted-foreground text-xs font-semibold mb-1" style={{ fontVariant: 'small-caps' }}>
                    {t('home.stats.altitude', 'Altitudine max')}
                  </div>
                  <div className="text-xl font-bold flex items-center gap-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <Tree weight="fill" className="text-primary" size={18} />
                    1.268m
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-semibold mb-1" style={{ fontVariant: 'small-caps' }}>
                    {t('home.stats.weather', 'Meteo live')}
                  </div>
                  <div className="text-xl font-bold flex items-center gap-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <CloudRain weight="fill" className="text-primary-light" size={18} />
                    8°C
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs font-semibold mb-1" style={{ fontVariant: 'small-caps' }}>
                    {t('home.stats.stops', 'Fermate')}
                  </div>
                  <div className="text-xl font-bold flex items-center gap-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    <MapPin weight="fill" className="text-wood" size={18} />
                    21
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section ref={journeyRef} aria-label="Journey scroll" className="pt-2">
        <SectionErrorBoundary
          fallback={(
            <div className="mx-auto max-w-5xl px-6 pb-24">
              <div className="rounded-3xl border border-border/60 bg-card/80 p-8 shadow-[var(--shadow-elevated)] backdrop-blur-xl">
                <div className="inline-flex items-center gap-2 rounded-2xl bg-primary/8 px-4 py-2 text-sm font-semibold text-primary">
                  {isItalian ? 'Sezione in aggiornamento' : 'Section updating'}
                </div>
                <h2 className="mt-5 text-3xl font-serif font-bold tracking-tight text-foreground md:text-4xl">
                  {isItalian ? 'Il percorso narrativo non e disponibile in questo momento' : 'The narrative journey is not available right now'}
                </h2>
                <p className="mt-4 max-w-[58ch] text-base leading-relaxed text-muted-foreground">
                  {isItalian
                    ? 'La home resta accessibile, ma questa sezione e stata temporaneamente isolata per evitare errori di rendering durante l\'aggiornamento della demo.'
                    : 'The home page remains accessible, but this section has been temporarily isolated to prevent rendering errors while the demo is being updated.'}
                </p>
              </div>
            </div>
          )}
        >
          <Journey />
        </SectionErrorBoundary>
      </section>

    </div>
  );
}
