import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STATIONS_DATA } from './fermate.js';

gsap.registerPlugin(ScrollTrigger);

function shouldDisableJourney() {
  return (
    window.matchMedia('(max-width: 900px)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

export function initJourney() {
  const root = document.getElementById('journey');
  if (!root) return;
  if (shouldDisableJourney()) return;

  const scrollSpace = document.querySelector('.journey-scrollspace');
  const svgPath = document.getElementById('journey-path-line');
  const walker = document.getElementById('journey-walker');
  const popup = document.getElementById('journey-popup');
  const popupImg = document.getElementById('journey-popup-img');
  const popupTag = document.getElementById('journey-popup-tag');
  const popupTitle = document.getElementById('journey-popup-title');
  const popupText = document.getElementById('journey-popup-text');
  const markers = Array.from(root.querySelectorAll('.journey-marker'));

  if (!scrollSpace || !svgPath || !walker || !popup || !popupImg || !popupTag || !popupTitle || !popupText) return;

  const byKey = Object.fromEntries(STATIONS_DATA.map(s => [s.key, s]));
  const stops = ['sulmona', 'castel', 'campo'];
  const stopProgress = { sulmona: 0.10, castel: 0.52, campo: 0.86 };
  let activeStop = null;

  const viewW = 200;
  const viewH = 720;
  const totalLen = svgPath.getTotalLength();

  const setMarkerActive = (key) => {
    markers.forEach(m => m.classList.toggle('is-active', m.dataset.stop === key));
  };

  const setPopup = (key) => {
    if (activeStop === key) return;
    const s = byKey[key];
    if (!s) return;
    activeStop = key;

    setMarkerActive(key);

    gsap.to(popup, {
      autoAlpha: 0,
      y: 10,
      duration: 0.25,
      ease: 'power2.out',
      onComplete: () => {
        popupImg.src = s.photo;
        popupImg.alt = `Foto della stazione di ${s.name}`;
        popupTag.textContent = `${s.emoji} ${s.tag} · ${s.altitude}`;
        popupTitle.textContent = s.name;
        popupText.textContent = s.desc;

        gsap.to(popup, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' });
      },
    });
  };

  // Place markers on the SVG path based on progress points.
  const placeMarkers = () => {
    markers.forEach(m => {
      const key = m.dataset.stop;
      const p = clamp01(stopProgress[key] ?? 0);
      const pt = svgPath.getPointAtLength(totalLen * p);
      const left = (pt.x / viewW) * 100;
      const top = (pt.y / viewH) * 100;
      m.style.left = left + '%';
      m.style.top = top + '%';
    });
  };
  placeMarkers();

  // Set initial content.
  setPopup('sulmona');
  gsap.set(popup, { autoAlpha: 1, y: 0 });

  // Pin fullscreen section and drive progress with scroll.
  const setWalkerLeft = gsap.quickSetter(walker, 'left');
  const setWalkerTop = gsap.quickSetter(walker, 'top');

  ScrollTrigger.create({
    trigger: root,
    start: 'top top',
    end: () => '+=' + Math.max(window.innerHeight * 2.8, 2200),
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
      const pt = svgPath.getPointAtLength(totalLen * self.progress);
      setWalkerLeft((pt.x / viewW) * 100 + '%');
      setWalkerTop((pt.y / viewH) * 100 + '%');

      const prog = self.progress;
      const nextStop =
        prog < 0.33 ? 'sulmona' :
        prog < 0.70 ? 'castel' :
        'campo';
      setPopup(nextStop);
    },
  });

  // Keep the spacer roughly consistent with the pinned duration.
  // (Spacer is only to make the page scroll naturally after the pin section.)
  const syncSpacer = () => {
    scrollSpace.style.height = Math.max(window.innerHeight * 2.8, 2200) + 'px';
    placeMarkers();
    ScrollTrigger.refresh();
  };
  syncSpacer();
  window.addEventListener('resize', () => {
    if (shouldDisableJourney()) return;
    syncSpacer();
  });
}

