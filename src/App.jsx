import React, { useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './components/ThemeContext';
import Navbar from './components/layout/Navbar';
import SiteFooter from './components/layout/SiteFooter';
import CookiePopup from './components/CookiePopup';
import Home from './pages/Home';
import Storia from './pages/Storia';
import Fermate from './pages/Fermate';
import Meteo from './pages/Meteo';
import ComeSalire from './pages/ComeSalire';
import InfoUtili from './pages/InfoUtili';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import LegalNotice from './pages/LegalNotice';
import AccessibilityNotice from './pages/AccessibilityNotice';
import NotFound from './pages/NotFound';
import './globals.css';

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
    requestAnimationFrame(reset);
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
            <MainRoutes />
          </main>
          <SiteFooter />
        </div>
        <CookiePopup />
      </Router>
    </ThemeProvider>
  );
}

export default App;
