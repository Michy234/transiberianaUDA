import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Subway, Translate, List, X, Sun, Moon, CloudRain } from '@phosphor-icons/react';
import { useTheme } from '../ThemeContext';
import { useI18n } from '../../i18n/index.jsx';

const navLinks = [
  { path: '/', key: 'nav.home', label: 'Home' },
  { path: '/storia', key: 'nav.storia', label: 'La Storia' },
  { path: '/fermate', key: 'nav.fermate', label: 'Le Fermate' },
  { path: '/come-salire', key: 'nav.attivita', label: 'Attività' },
  { path: '/info-utili', key: 'nav.info', label: 'Info Utili' },
  { path: '/decalogo-ambientale', key: 'nav.decalogo', label: 'Decalogo ambientale' },
  { path: '/meteo', key: 'nav.meteo', label: 'Meteo Live' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { theme, isDark, toggle } = useTheme();
  const { lang, setLang, languages, t } = useI18n();
  const location = useLocation();
  const navPillRef = useRef(null);
  const langMenuRef = useRef(null);
  const linkRefs = useRef(new Map());
  const [pill, setPill] = useState(null);

  const setLinkRef = useCallback((path) => (node) => {
    if (node) {
      linkRefs.current.set(path, node);
    } else {
      linkRefs.current.delete(path);
    }
  }, []);

  const updatePill = useCallback(() => {
    const container = navPillRef.current;
    const activeLink = linkRefs.current.get(location.pathname);

    if (!container || !activeLink) {
      setPill(null);
      return;
    }

    if (container.offsetWidth === 0 || container.offsetHeight === 0) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    setPill({
      left: linkRect.left - containerRect.left,
      top: linkRect.top - containerRect.top,
      width: linkRect.width,
      height: linkRect.height,
    });
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangMenuOpen(false);
  }, [location.pathname]);

  useLayoutEffect(() => {
    updatePill();
  }, [updatePill, scrolled]);

  useEffect(() => {
    const handleResize = () => updatePill();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updatePill]);

  useEffect(() => {
    if (!langMenuOpen) return;
    const handleClick = (event) => {
      if (!langMenuRef.current) return;
      if (!langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setLangMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [langMenuOpen]);

  return (
    <>
	      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'py-3 bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-[var(--shadow-nav)]' 
            : 'py-5 bg-transparent'
        }`}
        role="navigation"
        aria-label={t('nav.aria.main', 'Navigazione principale')}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
	          <Link
              to="/"
              className="flex items-center gap-3 group"
              aria-label={t('nav.aria.homeLink', "Transiberiana d'Abruzzo - Torna alla home")}
            >
	            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/15 transition-all duration-300">
	              <Subway size={22} weight="fill" />
	            </div>
	            <div className="flex flex-col">
	              <span className="font-bold text-lg leading-none tracking-tight text-foreground">Transiberiana</span>
	              <span className="text-xs text-muted-foreground leading-none mt-0.5 font-medium">d'Abruzzo</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div
            ref={navPillRef}
            className="hidden lg:flex items-center gap-1 bg-card/70 p-1.5 rounded-2xl backdrop-blur-md border border-border/50 shadow-[var(--shadow-subtle)] relative"
          >
            {pill && (
              <motion.div
                className="absolute left-0 top-0 bg-primary rounded-xl shadow-[var(--shadow-subtle)] pointer-events-none"
                initial={false}
                animate={{
                  x: pill.left,
                  y: pill.top,
                  width: pill.width,
                  height: pill.height,
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              />
            )}
	            {navLinks.map((link) => {
                const label = t(link.key, link.label);
	              const isActive = location.pathname === link.path;
	              const isMeteoLive = link.path === '/meteo';
	              return (
	                <Link
	                  key={link.path}
	                  to={link.path}
	                  ref={setLinkRef(link.path)}
		                  className={`relative z-10 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
		                    isActive ? 'text-primary-foreground' : 'text-foreground/60 hover:text-foreground'
		                  } ${isMeteoLive ? 'bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30' : ''}`}
		                >
		                  {isMeteoLive && (
                        <CloudRain
                          size={16}
                          weight="fill"
                          className={`inline-block mr-1.5 ${isActive ? 'text-primary-foreground' : 'text-primary'}`}
                        />
                      )}
		                  {label}
		                </Link>
		              );
		            })}
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle — Sun/Moon animated */}
            <button
              onClick={toggle}
              className="w-10 h-10 rounded-xl bg-card/70 border border-border/50 flex items-center justify-center text-primary hover:bg-card hover:scale-105 active:scale-95 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 relative overflow-hidden"
              aria-label={isDark ? t('theme.light', 'Passa al tema chiaro') : t('theme.dark', 'Passa al tema scuro')}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 180, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Moon size={18} weight="fill" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 180, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Sun size={18} weight="fill" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <div ref={langMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((open) => !open)}
                className="w-10 h-10 rounded-xl bg-card/70 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={t('lang.toggle', 'Cambia lingua')}
                aria-haspopup="listbox"
                aria-expanded={langMenuOpen}
              >
                <Translate size={18} />
              </button>
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2 w-44 rounded-2xl bg-card/95 border border-border/50 shadow-[var(--shadow-elevated)] backdrop-blur-xl p-1.5 z-50"
                    role="listbox"
                    aria-label={t('lang.label', 'Seleziona lingua')}
                  >
                    {languages.map((option) => {
                      const isActive = lang === option.code;
                      return (
                        <button
                          key={option.code}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onClick={() => {
                            setLang(option.code);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full px-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-between transition-all duration-200 ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-foreground/70 hover:text-foreground hover:bg-card'
                          }`}
                        >
                          <span className="truncate">{option.label}</span>
                          <span className={`text-xs font-semibold ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                            {option.short}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile Toggle */}
            <button
              className="lg:hidden w-10 h-10 rounded-xl bg-card/70 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? t('nav.closeMenu', 'Chiudi menu') : t('nav.openMenu', 'Apri menu')}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <List size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl flex flex-col justify-center items-center p-6"
            role="dialog"
            aria-label={t('nav.aria.mobile', 'Menu di navigazione')}
          >
            <nav className="flex flex-col w-full max-w-sm gap-3">
              {navLinks.map((link, i) => {
                const label = t(link.key, link.label);
                return (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 25 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-xl font-semibold p-4 rounded-2xl transition-all duration-200 ${
                      location.pathname === link.path 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-foreground hover:bg-secondary'
                    }`}
                  >
                    {label}
                  </Link>
                </motion.div>
              );
            })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
