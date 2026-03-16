/**
 * fermate.js — Renders the three station cards dynamically
 */

export const STATIONS_DATA = [
  {
    key: 'sulmona',
    name: 'Sulmona',
    tag: 'Porta del Parco',
    altitude: '375 m s.l.m.',
    bannerClass: 'fermata-banner-sulmona',
    desc: 'Città natale di Ovidio e capitale dei confetti, Sulmona è la porta del Parco Nazionale della Majella. Stazione di partenza del treno storico, offre un centro storico medievale ricchissimo di arte e gastronomia.',
    emoji: '🌿',
    facts: ['🏛️ Centro medievale', '🍬 Capitale dei confetti', '🏔️ Parco Majella', '🚉 Stazione di partenza'],
    photo: '/photos/fermate/sulmona-fermata.webp',
    tempId: 'temp-sulmona',
    dotId: 'dot-sulmona',
  },
  {
    key: 'castel',
    name: 'Castel di Sangro',
    tag: 'Cuore della rotta',
    altitude: '793 m s.l.m.',
    bannerClass: 'fermata-banner-castel',
    desc: 'A quasi 800 metri di quota, Castel di Sangro è il vero cuore della Transiberiana. Circondata da montagne e boschi di faggio, è una meta ideale per amanti della natura, dello sci e degli arrosticini.',
    emoji: '❄️',
    facts: ['⛷️ Comprensorio sciistico', '🥩 Arrosticini DOC', '🏰 Rocca Medievale', '🌲 Boschi di faggio'],
    photo: '/photos/fermate/castel-di-sangro.webp',
    tempId: 'temp-castel',
    dotId:  'dot-castel',
    arduino: true,
  },
  {
    key: 'campo',
    name: 'Campo di Giove',
    tag: 'La vetta',
    altitude: '1.060 m s.l.m.',
    bannerClass: 'fermata-banner-campo',
    desc: 'Il borgo più alto della ferrovia, adagiato sull\'altopiano della Majella. D\'inverno diventa un paesaggio da fiaba, mentre in estate regala escursioni tra flora appenninica e panorami sconfinanti.',
    emoji: '🏔️',
    facts: ['🌸 Flora appenninica', '🎿 Sport invernali', '🌄 Vista panoramica', '🫙 Prodotti tipici'],
    photo: '/photos/fermate/campo-di-giove.webp',
    tempId: 'temp-campo',
    dotId:  'dot-campo',
  },
];

export function initFermate() {
  const grid = document.getElementById('fermate-grid');
  if (!grid) return;

  grid.innerHTML = STATIONS_DATA.map(s => `
    <div class="fermata-card">
      <div class="fermata-banner ${s.bannerClass}" style="--banner-img: url('${s.photo}')">
        <div class="fermata-scenery">${makeSVGScenery(s.key)}</div>
        <div class="fermata-altitude-badge">${s.altitude}</div>
        <div class="fermata-live-chip" id="chip-${s.key}">
          <span class="live-chip-dot"></span>
          <span class="live-chip-temp" id="chip-temp-${s.key}">…</span>
          <span class="live-chip-label">ora</span>
        </div>
      </div>
      <div class="fermata-body">
        <div class="fermata-tag">${s.emoji} ${s.tag}</div>
        <h3 class="fermata-name">${s.name}</h3>
        <p class="fermata-desc">${s.desc}</p>
        <div class="fermata-facts">
          ${s.facts.map(f => `<span class="fermata-fact">${f}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/** Update temperature badge inside a station card */
export function updateFermataTemp(stationKey, tempC) {
  const el = document.getElementById(`chip-temp-${stationKey}`);
  if (el) el.textContent = tempC !== null ? tempC.toFixed(1) + '°C' : '—';
  const chip = document.getElementById(`chip-${stationKey}`);
  if (chip) chip.classList.add('loaded');
}

/** Inline SVG scenery per station */
function makeSVGScenery(key) {
  const scenes = {
    sulmona: `<svg viewBox="0 0 400 180" width="100%" style="position:absolute;bottom:0">
      <rect width="400" height="180" fill="none"/>
      <!-- Mountains -->
      <polygon points="0,180 80,60 160,180" fill="rgba(39,174,96,0.15)"/>
      <polygon points="100,180 200,40 300,180" fill="rgba(39,174,96,0.20)"/>
      <polygon points="220,180 320,70 400,180" fill="rgba(39,174,96,0.12)"/>
      <!-- Snow caps -->
      <polygon points="200,40 185,75 215,75" fill="rgba(255,255,255,0.35)"/>
      <!-- Train track -->
      <line x1="0" y1="165" x2="400" y2="165" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <line x1="0" y1="170" x2="400" y2="170" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      ${[30,80,130,180,230,280,330,380].map(x=>`<line x1="${x}" y1="165" x2="${x}" y2="170" stroke="rgba(255,255,255,0.2)" stroke-width="3"/>`).join('')}
    </svg>`,
    castel: `<svg viewBox="0 0 400 180" width="100%" style="position:absolute;bottom:0">
      <polygon points="0,180 60,80 120,180" fill="rgba(41,128,185,0.18)"/>
      <polygon points="80,180 180,30 280,180" fill="rgba(41,128,185,0.25)"/>
      <polygon points="240,180 330,60 400,180" fill="rgba(41,128,185,0.15)"/>
      <!-- Snow -->
      <polygon points="180,30 162,68 198,68" fill="rgba(255,255,255,0.55)"/>
      <polygon points="60,80 48,105 72,105" fill="rgba(255,255,255,0.4)"/>
      <!-- Stars -->
      ${[[20,30],[350,25],[300,55],[100,15]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.5" fill="rgba(255,255,255,0.6)"/>`).join('')}
      <!-- Track -->
      <line x1="0" y1="165" x2="400" y2="165" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <line x1="0" y1="170" x2="400" y2="170" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
    </svg>`,
    campo: `<svg viewBox="0 0 400 180" width="100%" style="position:absolute;bottom:0">
      <polygon points="50,180 150,20 250,180" fill="rgba(139,92,246,0.22)"/>
      <polygon points="180,180 280,45 380,180" fill="rgba(139,92,246,0.18)"/>
      <polygon points="0,180 70,90 140,180" fill="rgba(139,92,246,0.12)"/>
      <!-- Snow caps -->
      <polygon points="150,20 132,58 168,58" fill="rgba(255,255,255,0.6)"/>
      <polygon points="280,45 265,75 295,75" fill="rgba(255,255,255,0.5)"/>
      <!-- Stars -->
      ${[[30,20],[360,30],[200,10],[320,15]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.5" fill="rgba(255,255,255,0.7)"/>`).join('')}
      <!-- Track -->
      <line x1="0" y1="165" x2="400" y2="165" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <line x1="0" y1="170" x2="400" y2="170" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
    </svg>`,
  };
  return scenes[key] || '';
}
