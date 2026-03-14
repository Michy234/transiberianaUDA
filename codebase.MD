<!--
Documento sintetico della codebase.
Scopo: aiutare altre IA a capire rapidamente “dove sta cosa” e come funziona.
-->

# Codebase — panoramica breve

Sito didattico per “Transiberiana d’Abruzzo” costruito con **Vite + React**.
È una **SPA** con routing client‑side (React Router), tema chiaro/scuro, pagine narrative e una dashboard meteo live basata su Open‑Meteo.

---

## Mappa veloce (dove sta cosa)

### Root
- `index.html` → entry HTML, contiene `#root` e carica `src/main.jsx`.
- `package.json` → script `dev/build/preview` Vite, dipendenze React, Chart.js, Framer Motion, GSAP, Tailwind.
- `vite.config.js` → config Vite.
- `dist/` → output build (generato).
- `public/` → asset statici serviti da Vite (foto, icone, locali).
- `data/arduino.json` → JSON aggiornato dai sensori (per meteo live Arduino).
- `arduino/transiberiana_sensor.ino` → sketch Arduino per inviare i dati.

### Frontend React
- `src/main.jsx` → bootstrap React, monta `App`.
- `src/App.jsx` → router + layout principale + `ThemeProvider` + `Navbar`.
- `src/pages/` → pagine principali della SPA.
- `src/components/` → componenti UI riusabili (tema, navbar, chart).
- `src/api/` → fetch dati meteo e polling Arduino.
- `src/globals.css` → tema + Tailwind design tokens.

### Legacy/compatibilità (non usato dalla SPA)
- `src/sections/`, `src/charts/`, `src/stats/` → moduli DOM‑based per una versione statica precedente.
- `style/` → vecchi CSS della versione MPA/statica.
- `src/counter.js`, `src/style.css` → residue del template Vite.

---

## Flusso runtime (come funziona)

1. **Entry**: `index.html` → carica `src/main.jsx`.
2. **Bootstrap**: `main.jsx` rende `<App />`.
3. **App**: `App.jsx` applica `ThemeProvider`, `Navbar` e `Routes`.
4. **Routing**: `react-router-dom` gestisce le pagine:
   - `/` Home
   - `/storia` Storia
   - `/fermate` Fermate
   - `/meteo` Meteo live
   - `/come-salire` Come salire
   - `/info-utili` Info utili

---

## Pagine principali (cosa contengono)

- `src/pages/Home.jsx`
  - Hero + CTA + “journey” scroll, animazioni GSAP.
  - Integra `Journey` come sezione lunga narrativa.

- `src/pages/Journey.jsx`
  - Timeline storica + fermate + form email.
  - Animazioni GSAP/ScrollTrigger, snap su step, salvataggio email in localStorage.

- `src/pages/Storia.jsx`
  - Timeline con progress bar (Framer Motion).

- `src/pages/Fermate.jsx`
  - Lista fermate con card dettagli (Framer Motion).

- `src/pages/Meteo.jsx`
  - Stato loading/error/ready.
  - Usa `fetchCurrentConditions()` per dati live.
  - Include `WeatherChart` per grafico storico/periodi.

- `src/pages/ComeSalire.jsx`
  - Steps informativi con card animate.

- `src/pages/InfoUtili.jsx`
  - FAQ + link esterni e regole a bordo.

---

## Meteo: dati e grafici

### Open‑Meteo (fonte principale)
- `src/api/openmeteo.js`
  - **STATIONS**: Sulmona, Castel di Sangro, Campo di Giove.
  - `fetchCurrentConditions()` → condizioni attuali (temperatura/umidità/pressione).
  - `fetchStationData(station, period)`:
    - Periodi brevi (`24h`, `7d`) → endpoint *forecast* (hourly).
    - Periodi lunghi (`30d`, `1y`, `2y`) → endpoint *archive* (daily).

### Grafici
- `src/components/WeatherChart.jsx`
  - Grafico Chart.js in React.
  - Filtri: città, periodo, metriche.
  - Calcola statistiche base (media/mediana/moda) client‑side.

### Arduino (sensori locali)
- `arduino/transiberiana_sensor.ino` → invia JSON a server.
- `data/arduino.json` → file letto dal frontend.
- `src/api/arduino.js` → polling ogni 30s.
  - **Nota**: il polling Arduino è **usato solo** nei moduli legacy `src/sections/`.

---

## Tema e UI

- `src/components/ThemeContext.jsx`
  - Gestione tema light/dark.
  - Usa `data-theme` su `<html>` e localStorage.

- `src/globals.css`
  - Design tokens (colori, ombre, font).
  - Animazioni (snowfall, pulse, ecc.).
  - Base styles per Tailwind v4.

---

## Asset statici

- `public/photos/` → immagini sezioni e fermate.
- `public/icons.svg`, `public/favicon.svg`
- `public/locales/*.json` → traduzioni (legacy i18n).

---

## Moduli legacy (se devi riusarli)

Questa parte era pensata per una **versione statica** con manipolazione DOM:

- `src/sections/meteo.js` → orchestration meteo (Open‑Meteo + Arduino + stats + Chart.js).
- `src/charts/meteoChart.js` → Chart.js multiplo con temi.
- `src/stats/calculator.js` → media/mediana/moda/min/max.
- `src/sections/fermate.js` → genera card HTML delle fermate.
- `src/api/i18n.js` + `public/locales/` → traduzioni via `data-i18n`.

Attualmente **non** sono importati in `src/main.jsx`, quindi non girano nella SPA React.

---

## Come si avvia

- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
