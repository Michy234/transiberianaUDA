import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, CloudRain, MapPin, Tree } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Journey from './Journey';

gsap.registerPlugin(ScrollToPlugin);

const sponsorLogos = [
  {
    src: '/photos/sponsors/silente.webp',
    alt: 'Parco Sirente Velino',
    href: 'https://www.parcosirentevelino.it/',
  },
  {
    src: '/photos/sponsors/tua.webp',
    alt: 'TUA Abruzzo',
    href: 'https://www.tuabruzzo.it/',
  },
  {
    src: '/photos/sponsors/fs.webp',
    alt: 'Fondazione FS',
    href: 'https://www.fondazionefs.it/',
  },
  {
    src: '/photos/sponsors/tti.webp',
    alt: 'FS Treni Turistici Italiani',
    href: 'https://www.fstrenituristici.it/',
  },
  {
    src: '/photos/sponsors/maiella.webp',
    alt: 'Parco Nazionale della Maiella',
    href: 'https://www.parcomajella.it/',
  },
  {
    src: '/photos/sponsors/abruzzo.webp',
    alt: 'Parco Nazionale d’Abruzzo, Lazio e Molise',
    href: 'https://www.parcoabruzzo.it/',
  },
];

function getNavOffset() {
  if (typeof window === 'undefined') return 0;
  const nav = document.querySelector('nav');
  return nav ? nav.offsetHeight + 8 : 0;
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function Home() {
  const journeyRef = useRef(null);

  const handleStartJourney = () => {
    const target = journeyRef.current;
    if (!target || typeof window === 'undefined') return;

    const offset = getNavOffset();
    if (prefersReducedMotion()) {
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
      <section className="min-h-[100dvh] w-full flex flex-col lg:flex-row relative overflow-hidden">
        {/* Mobile background image */}
        <div className="absolute inset-0 lg:hidden" aria-hidden="true">
          <img
            src="/photos/storia/transiberiana.jpg"
            alt=""
            className="h-full w-full object-cover blur-[2px]"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-transparent to-background/40" />
        </div>

        {/* Left Content (55%) */}
        <div className="relative z-10 w-full lg:w-[55%] flex items-center px-6 md:px-12 lg:px-20 pt-32 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.2 }}
            className="max-w-xl mx-auto text-center lg:mx-0 lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-2 rounded-2xl bg-primary/8 text-primary text-sm font-semibold tracking-tight mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-gentle-pulse" aria-hidden="true"></span>
              Prossima partenza: Sulmona
            </div>
            
            <div className="inline-block mb-8 rounded-[28px] bg-white/18 backdrop-blur-md border border-white/35 shadow-[0_10px_28px_-26px_rgba(0,0,0,0.28)] px-5 py-4 lg:mb-8 lg:bg-transparent lg:border-0 lg:shadow-none lg:px-0 lg:py-0">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-[-0.03em] leading-[1.08] text-foreground">
                La <span className="text-primary italic">Transiberiana</span> <br />
                d'Abruzzo
              </h1>
            </div>
            
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed max-w-[50ch] mb-10 mx-auto lg:mx-0 bg-white/80 dark:bg-background/70 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-[var(--shadow-subtle)] lg:bg-transparent lg:dark:bg-transparent lg:backdrop-blur-0 lg:px-0 lg:py-0 lg:shadow-none">
              Un'esperienza autentica a bordo di carrozze d'epoca. Attraversa i Parchi Nazionali e i borghi più belli dell'Appennino Centrale.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4">
              <button 
                type="button"
                onClick={handleStartJourney}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[var(--shadow-button)]"
              >
                Inizia il viaggio
                <ArrowRight weight="bold" size={18} />
              </button>
              <Link 
                to="/fermate" 
                className="px-8 py-4 bg-card text-foreground rounded-2xl font-semibold flex items-center justify-center hover:shadow-[var(--shadow-card)] transition-all duration-300 border border-border/60"
              >
                Scopri l'itinerario
              </Link>
            </div>
            <div className="mt-[1.75rem] flex items-start justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
              <span className="relative top-1 inline-flex text-primary animate-journey-arrow motion-reduce:animate-none" aria-hidden="true">
                <ArrowDown size={16} />
              </span>
              <span>Scorri per iniziare il viaggio</span>
            </div>
          </motion.div>
        </div>

        {/* Right Image (45%) with overlap - desktop only */}
        <div className="hidden lg:flex w-full lg:w-[45%] min-h-[50vh] lg:min-h-0 relative p-4 md:p-6 lg:p-8 items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="w-full h-full relative rounded-3xl overflow-hidden shadow-[var(--shadow-elevated)] lg:-ml-12"
          >
            <img 
              src="/photos/storia/transiberiana.jpg" 
              alt="Treno storico che attraversa un viadotto immerso nella vegetazione delle montagne abruzzesi" 
              className="object-cover w-full h-full"
              loading="eager"
            />
            
            {/* Warm Floating Stats Card */}
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 100, damping: 20 }}
              className="absolute bottom-6 left-6 right-6 z-20 bg-card/90 backdrop-blur-lg p-5 rounded-2xl shadow-[var(--shadow-card)] border border-border/40"
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
          </motion.div>
        </div>
      </section>

      <section className="py-4 md:py-5 px-0 bg-background">
        <div className="w-full text-center">
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.28em] mb-6">
            PARTNER E SPONSOR
          </div>
          <div className="relative overflow-hidden border-y border-border/60 bg-card/60 backdrop-blur-xl px-6 py-5">
            <div
              className="sponsor-marquee"
              aria-label="Partner e sponsor della Transiberiana d'Abruzzo"
            >
              <div className="sponsor-track">
                <div className="sponsor-track-inner">
                  {sponsorLogos.map((logo) => (
                    <a
                      key={logo.src}
                      href={logo.href}
                      target="_blank"
                      rel="noreferrer"
                      className="sponsor-item sponsor-link"
                    >
                      <img src={logo.src} alt={logo.alt} loading="eager" decoding="async" />
                    </a>
                  ))}
                </div>
                <div className="sponsor-track-inner" aria-hidden="true">
                  {sponsorLogos.map((logo) => (
                    <a
                      key={`${logo.src}-dup`}
                      href={logo.href}
                      target="_blank"
                      rel="noreferrer"
                      className="sponsor-item sponsor-link"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <img src={logo.src} alt="" loading="eager" decoding="async" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={journeyRef} aria-label="Journey scroll" className="pt-2">
        <Journey />
      </section>

    </div>
  );
}
