import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STATIONS_DATA } from './fermate.js';

gsap.registerPlugin(ScrollTrigger);

function shouldDisableJourney() {
  return window.matchMedia('(max-width: 900px)').matches;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
  const railLeft = document.getElementById('journey-rail-left');
  const railRight = document.getElementById('journey-rail-right');
  const railLeftShadow = document.getElementById('journey-rail-left-shadow');
  const railRightShadow = document.getElementById('journey-rail-right-shadow');
  const railTies = document.getElementById('journey-rail-ties');

  if (!scrollSpace || !svgPath || !walker || !popup || !popupImg || !popupTag || !popupTitle || !popupText || !railLeft || !railRight || !railLeftShadow || !railRightShadow || !railTies) return;

  const byKey = Object.fromEntries(STATIONS_DATA.map(s => [s.key, s]));
  const stopProgress = { sulmona: 0.18, castel: 0.52, campo: 0.84 };
  let activeStop = null;

  const bgLayers = Array.from(root.querySelectorAll('.journey-full-bg-layer'));

  const viewW = 1000;
  const viewH = 1400;
  const totalLen = svgPath.getTotalLength();

  const buildLinePath = (points) => {
    if (!points.length) return '';
    return `M${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)} ` + points.slice(1).map((p) => `L${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');
  };

  const updateRailGeometry = () => {
    const segments = 220;
    const halfGauge = 24;
    const leftPts = [];
    const rightPts = [];

    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const len = totalLen * t;
      const p = svgPath.getPointAtLength(len);
      const prev = svgPath.getPointAtLength(Math.max(0, len - 6));
      const next = svgPath.getPointAtLength(Math.min(totalLen, len + 6));
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      const mag = Math.hypot(dx, dy) || 1;
      const nx = -dy / mag;
      const ny = dx / mag;

      leftPts.push({ x: p.x + nx * halfGauge, y: p.y + ny * halfGauge });
      rightPts.push({ x: p.x - nx * halfGauge, y: p.y - ny * halfGauge });
    }

    const leftPath = buildLinePath(leftPts);
    const rightPath = buildLinePath(rightPts);
    railLeft.setAttribute('d', leftPath);
    railRight.setAttribute('d', rightPath);
    railLeftShadow.setAttribute('d', leftPath);
    railRightShadow.setAttribute('d', rightPath);

    railTies.replaceChildren();
    const tieEvery = 16;
    for (let i = 0; i <= segments; i += tieEvery) {
      const a = leftPts[i];
      const b = rightPts[i];
      if (!a || !b) continue;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', a.x.toFixed(2));
      line.setAttribute('y1', a.y.toFixed(2));
      line.setAttribute('x2', b.x.toFixed(2));
      line.setAttribute('y2', b.y.toFixed(2));
      railTies.append(line);
    }
  };

  const setMarkerActive = (key) => {
    markers.forEach(m => m.classList.toggle('is-active', m.dataset.stop === key));
  };


  const setBackground = (key) => {
    bgLayers.forEach(layer => layer.classList.toggle('is-active', layer.dataset.stop === key));
  };

  const setAtStop = (progress) => {
    const isAtStop = Object.values(stopProgress).some((p) => Math.abs(progress - p) < 0.045);
    root.classList.toggle('is-at-stop', isAtStop);
  };

  const setPopup = (key) => {
    if (activeStop === key) return;
    const s = byKey[key];
    if (!s) return;
    activeStop = key;

    setMarkerActive(key);
    setBackground(key);

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
  updateRailGeometry();

  // Set initial content.
  setPopup('sulmona');
  setAtStop(stopProgress.sulmona);
  gsap.set(popup, { autoAlpha: 1, y: 0 });

  // Pin fullscreen section and drive progress with scroll.
  const setWalkerLeft = gsap.quickSetter(walker, 'left');
  const setWalkerTop = gsap.quickSetter(walker, 'top');
  const setWalkerRotation = gsap.quickSetter(walker, 'rotation');

  const setWalkerPosition = (progress) => {
    const len = totalLen * clamp01(progress);
    const pt = svgPath.getPointAtLength(len);
    const lookAhead = svgPath.getPointAtLength(Math.min(totalLen, len + 8));
    const angle = Math.atan2(lookAhead.y - pt.y, lookAhead.x - pt.x) * (180 / Math.PI);
    setWalkerLeft((pt.x / viewW) * 100 + '%');
    setWalkerTop((pt.y / viewH) * 100 + '%');
    setWalkerRotation(angle);
  };

  gsap.set(walker, { transformOrigin: '50% 50%' });
  setWalkerPosition(0);

  if (prefersReducedMotion()) {
    root.classList.add('journey-static');
    setWalkerPosition(stopProgress.sulmona);
  } else {
    ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: () => '+=' + Math.max(window.innerHeight * 3.8, 3400),
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const prog = self.progress;
        setWalkerPosition(prog);
        setAtStop(prog);
        const nextStop =
          prog < 0.34 ? 'sulmona' :
          prog < 0.72 ? 'castel' :
          'campo';
        setPopup(nextStop);
      },
    });
  }

  // Keep the spacer roughly consistent with the pinned duration.
  // (Spacer is only to make the page scroll naturally after the pin section.)
  const syncSpacer = () => {
    if (prefersReducedMotion()) {
      scrollSpace.style.height = '0px';
      placeMarkers();
      updateRailGeometry();
      return;
    }
    scrollSpace.style.height = Math.max(window.innerHeight * 3.8, 3400) + 'px';
    placeMarkers();
    updateRailGeometry();
    ScrollTrigger.refresh();
  };
  syncSpacer();
  window.addEventListener('resize', () => {
    if (shouldDisableJourney()) return;
    syncSpacer();
  });
}

