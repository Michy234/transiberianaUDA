import React, { lazy, Suspense, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './components/ThemeContext';
import Navbar from './components/layout/Navbar';
import SiteFooter from './components/layout/SiteFooter';
import CookiePopup from './components/CookiePopup';
import './globals.css';

const Home = lazy(() => import('./pages/Home'));
const Storia = lazy(() => import('./pages/Storia'));
const Fermate = lazy(() => import('./pages/Fermate'));
const Meteo = lazy(() => import('./pages/Meteo'));
const ComeSalire = lazy(() => import('./pages/ComeSalire'));
const InfoUtili = lazy(() => import('./pages/InfoUtili'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const LegalNotice = lazy(() => import('./pages/LegalNotice'));
const AccessibilityNotice = lazy(() => import('./pages/AccessibilityNotice'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return (
    <div className="flex min-h-[45vh] items-center justify-center px-6 py-16 text-sm text-muted-foreground" aria-live="polite">
      Caricamento contenuti...
    </div>
  );
}

function MainRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/storia" element={<Storia />} />
        <Route path="/fermate" element={<Fermate />} />
        <Route path="/meteo" element={<Meteo />} />
        <Route path="/come-salire" element={<ComeSalire />} />
        <Route path="/info-utili" element={<InfoUtili />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/note-legali" element={<LegalNotice />} />
        <Route path="/accessibilita" element={<AccessibilityNotice />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    const reset = () => {
      root.scrollTop = 0;
      body.scrollTop = 0;
      window.scrollTo(0, 0);
    };

    reset();
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-background">
          <Navbar />
          <main className="flex-1 w-full relative">
            <Suspense fallback={<RouteFallback />}>
              <MainRoutes />
            </Suspense>
          </main>
          <SiteFooter />
        </div>
        <CookiePopup />
      </Router>
    </ThemeProvider>
  );
}

export default App;
