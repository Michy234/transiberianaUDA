import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './components/ThemeContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Storia from './pages/Storia';
import Journey from './pages/Journey';
import Fermate from './pages/Fermate';
import Meteo from './pages/Meteo';
import ComeSalire from './pages/ComeSalire';
import InfoUtili from './pages/InfoUtili';
import './globals.css';

function MainRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/viaggio" element={<Journey />} />
        <Route path="/storia" element={<Storia />} />
        <Route path="/fermate" element={<Fermate />} />
        <Route path="/meteo" element={<Meteo />} />
        <Route path="/come-salire" element={<ComeSalire />} />
        <Route path="/info-utili" element={<InfoUtili />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-[100dvh] flex-col overflow-x-hidden bg-background">
          <Navbar />
          <main className="flex-1 w-full relative">
            <MainRoutes />
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
