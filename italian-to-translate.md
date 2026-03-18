## index.html
- L6: <meta name="description" content="Transiberiana d'Abruzzo — Viaggio in treno storico tra i Parchi Nazionali e i borghi dell'Appennino Centrale. Meteo live, fermate, orari e info utili." />

## public/locales/it.json
- `hero.cta_meteo`: Meteo Live
- `hero.cta_start`: Inizia il Viaggio
- `hero.subtitle`: Un viaggio indimenticabile attraverso il cuore verde d'Italia.
- `hero.title`: Benvenuti sulla Transiberiana d'Abruzzo
- `nav.fermate`: Le Fermate
- `nav.home`: Home
- `nav.info`: Info Utili
- `nav.meteo`: Meteo Live
- `nav.salire`: Come Salire
- `nav.storia`: La Storia

## src/api/i18n.js
- L37: // e.g., <h1 data-i18n="hero.title">...</h1>
- L38: document.querySelectorAll('[data-i18n]').forEach(el => {

## src/api/openmeteo.js
- L8: castel:  { name: 'Castel di Sangro', lat: 41.783, lon: 14.108, altitude: 793, weatherUrl: 'https://www.3bmeteo.com/meteo/castel+di+sangro' },
- L9: campo:   { name: 'Campo di Giove', lat: 41.998, lon: 14.057, altitude: 1060, weatherUrl: 'https://www.3bmeteo.com/meteo/campo+di+giove' },
- L85: for (let i = 0; i < h.time.length; i++) {
- L94: for (let i = h.time.length - count; i < h.time.length; i++) {
- L95: if (i >= 0) indices.push(i);
- L100: times:         indices.map(i => h.time[i]),
- L101: temperature:   indices.map(i => h.temperature_2m[i]),
- L102: humidity:      indices.map(i => h.relative_humidity_2m[i]),
- L103: pressure:      indices.map(i => h.surface_pressure[i]),
- L104: precipitation: indices.map(i => h.precipitation[i]),

## src/charts/meteoChart.js
- L13: castel:  { temp: '#0ea5e9', humidity: '#38bdf8', pressure: '#0ea5e9' }, // Cyan/Blue
- L14: campo:   { temp: '#8b5cf6', humidity: '#a78bfa', pressure: '#8b5cf6' }, // Purple
- L34: text: cssVar('--text-primary', '#e8eaf0'),
- L36: text3: cssVar('--text-muted', '#5a6a7e'),
- L59: data:            values.map((v, i) => ({ x: times[i], y: v })),
- L126: const names = { sulmona: 'Sulmona', castel: 'Castel di Sangro', campo: 'Campo di Giove' };
- L159: ticks: { color: '#a78bfa', callback: v => v.toFixed(0) },
- L162: title: { display: true, text: 'hPa', color: '#a78bfa' },

## src/components/ScrollTelling.jsx
- L12: description: 'Città d\'arte, patria di Ovidio. Punto di partenza della Transiberiana.',
- L14: imageId: '1506260408121-e353d10b87c7'
- L17: id: 'castel-di-sangro',
- L18: name: 'Castel di Sangro',
- L19: description: 'Il cuore della Valle del Sangro. Meta strategica dell\'Appennino.',
- L26: description: 'Termine della linea. Città longobarda con un ricco patrimonio storico.',

## src/components/ThemeContext.jsx
- L44: // Only auto-switch if user hasn't manually set a preference
- L47: const newTheme = e.matches ? 'dark' : 'light';
- L80: throw new Error('useTheme must be used within a ThemeProvider');

## src/components/WeatherChart.jsx
- L11: { value: 'all', label: 'Tutte le città' },
- L13: { value: 'castel', label: 'Castel di Sangro' },
- L14: { value: 'campo', label: 'Campo di Giove' },
- L18: { value: 'temperature', label: 'Temperatura (°C)', color: '#e63946' },
- L20: { value: 'pressure', label: 'Pressione (hPa)', color: '#2a9d8f' },
- L30: sulmona: { border: '#6b9e7e', bg: 'rgba(107, 158, 126, 0.1)' },
- L31: castel: { border: '#c9a227', bg: 'rgba(201, 162, 39, 0.1)' },
- L32: campo: { border: '#e07a5f', bg: 'rgba(224, 122, 95, 0.1)' },
- L93: const sorted = [...values].sort((a, b) => a - b);
- L294: onChange={(e) => setSelectedCity(e.target.value)}
- L304: onChange={(e) => setSelectedPeriod(e.target.value)}
- L358: Statistiche ({selectedCity === 'all' ? 'tutte le città' : (STATIONS[selectedCity]?.name ?? selectedCity)})

## src/components/layout/Navbar.jsx
- L11: { path: '/come-salire', label: 'Attività' },
- L218: transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 25 }}

## src/data/storiaStops.js
- L6: summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vitae urna a justo vulputate gravida.',
- L7: story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vitae urna a justo vulputate gravida. Integer nec felis at ipsum dignissim laoreet. Donec sed aliquet lorem. Proin interdum, ipsum vel suscipit semper, arcu nisl commodo neque, eu tristique massa eros id felis. Curabitur ac massa a ex consectetur consequat. Maecenas vel malesuada lectus, quis aliquam augue.',
- L13: title: 'Campo di Giove',
- L15: story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean luctus, neque nec pulvinar sagittis, purus massa cursus massa, in pellentesque velit lectus a metus. Praesent suscipit quam id libero sollicitudin, at interdum lacus luctus. Sed non tortor sit amet nisi tempus consequat. Nulla facilisi.',
- L16: image: 'https://placehold.co/1200x900?text=Campo+di+Giove',
- L30: summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at enim non nisl bibendum tristique.',
- L31: story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at enim non nisl bibendum tristique. Sed dignissim, lectus a tincidunt posuere, leo arcu suscipit tortor, et accumsan lectus erat non justo. Morbi in mi sed mauris feugiat feugiat et ut lorem.',
- L37: title: 'Castel di Sangro',
- L40: image: 'https://placehold.co/1200x900?text=Castel+di+Sangro',

## src/globals.css
- L46: --primary: #6B9E7E;
- L52: --muted-foreground: #7A8B7A;
- L62: --ring: #6B9E7E;
- L82: --popover: #3A2F2A;
- L87: --secondary: #3A2F2A;
- L94: --accent-pink: #E8B4A2;
- L145: background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");

## src/pages/ComeSalire.jsx
- L13: spring: 'Fioriture e aria fresca: passeggiate morbide e ritmi lenti.',
- L14: summer: 'Giornate lunghe: cerca ombra, acqua fresca e panorami aperti.',
- L15: autumn: 'Colori caldi e sapori di stagione: perfetti per un ritmo tranquillo.',
- L16: winter: 'Atmosfera montana: attività brevi e soste al caldo.',
- L19: // Durate indicative: aggiornale qui quando disponibili.
- L27: timeHint: 'Ideale prima della partenza o al rientro',
- L28: desc: "La città dei confetti e di Ovidio. Punto di partenza dell'itinerario storico.",
- L34: mealTip: 'Se sei in fascia pranzo, scegli una trattoria nel centro.',
- L37: 'Passeggiata nel centro storico tra vicoli e piazze.',
- L38: 'Pausa in caffetteria con dolci tipici.',
- L41: "Percorso all'ombra lungo il corso principale.",
- L42: 'Gelato o bibita fresca in piazza.',
- L45: 'Botteghe artigiane e sapori di stagione.',
- L46: 'Pausa calda in un bar storico.',
- L49: 'Portici e chiese al coperto per una visita veloce.',
- L50: 'Cioccolata calda o dolce tipico.',
- L58: mealTip: 'Con 2-3 ore puoi fermarti per un pranzo tranquillo.',
- L61: 'Passeggiata più lunga tra quartieri storici e botteghe.',
- L65: 'Aperitivo leggero e passeggiata serale.',
- L66: 'Shopping di prodotti locali con calma.',
- L69: 'Degustazione di prodotti locali e botteghe.',
- L70: 'Passeggiata lenta tra scorci fotografici.',
- L73: 'Visita a spazi culturali al chiuso.',
- L74: 'Pausa lunga con bevanda calda.',
- L82: name: 'Campo di Giove',
- L87: desc: 'Ai piedi della Majella, incorniciata da fitti boschi e paesaggi mozzafiato.',
- L93: mealTip: 'Se è ora di pranzo, preferisci un posto veloce vicino alla stazione.',
- L96: 'Belvedere e foto sulle cime circostanti.',
- L100: 'Punto panoramico con aria fresca.',
- L101: 'Breve tratto ombreggiato e rifornimento acqua.',
- L104: 'Foliage e colori del bosco.',
- L105: 'Pausa in centro per sapori di stagione.',
- L108: 'Scorci innevati e foto rapide.',
- L109: 'Riscaldati con una bevanda calda.',
- L117: mealTip: 'Con 3 ore puoi fare una camminata e poi pranzare con calma.',
- L120: 'Scampagnata su sentieri facili tra boschi e radure.',
- L121: 'Pranzo in trattoria o picnic se il tempo lo consente.',
- L124: 'Passeggiata fresca nel verde e relax.',
- L125: "Pranzo all'aperto o in locale con cucina semplice.",
- L128: 'Passeggiata tra i colori del bosco.',
- L129: 'Pranzo caldo con sapori stagionali.',
- L132: 'Camminata breve in sicurezza e panorama innevato.',
- L145: timeHint: 'Sosta rapida e rigenerante',
- L146: desc: 'Stazione isolata nel Quarto Santa Chiara, regno della natura selvaggia.',
- L152: mealTip: 'Se sei in fascia pranzo, punta a uno snack veloce.',
- L155: 'Belvedere e foto panoramiche.',
- L156: 'Passeggiata breve nei dintorni della stazione.',
- L159: "Pausa all'ombra con vista aperta.",
- L160: 'Rifornisci acqua e riparti.',
- L163: 'Scorci con foliage e foto.',
- L167: 'Panorama innevato da punto sicuro.',
- L168: 'Bevanda calda prima della ripartenza.',
- L176: mealTip: "Con un po' di tempo, concediti una pausa seduto.",
- L179: 'Giro tranquillo nei dintorni con vista sui monti.',
- L180: 'Pausa caffetteria o merenda.',
- L183: 'Passeggiata più ampia con aria fresca.',
- L184: 'Sosta rinfrescante prima di ripartire.',
- L187: 'Passeggiata lenta tra i colori.',
- L188: 'Botteghe locali e sapori di stagione.',
- L192: 'Pausa calda in bar o rifugio.',
- L204: timeHint: 'Perfetta per una passeggiata più lunga',
- L205: desc: 'La stazione più alta della linea, rinomata per il turismo montano invernale ed estivo.',
- L211: mealTip: 'Se è ora di pranzo, scegli un posto vicino al centro.',
- L214: 'Passeggiata in centro e scorci montani.',
- L215: 'Pausa caffè con vista.',
- L218: 'Giro nel paese con aria fresca.',
- L219: 'Sosta rinfrescante e foto panoramiche.',
- L222: 'Colori di stagione e botteghe.',
- L223: 'Pausa calda prima della ripartenza.',
- L226: 'Atmosfera montana e scorci innevati.',
- L227: 'Bevanda calda o dolce locale.',
- L235: mealTip: 'Con 2-3 ore puoi pranzare e fare una passeggiata completa.',
- L238: 'Passeggiata più lunga in paese.',
- L239: 'Pranzo in trattoria con calma.',
- L242: 'Percorso nel verde e relax.',
- L243: "Pranzo all'aperto o in locale tipico.",
- L246: 'Sentiero facile tra i colori.',
- L247: 'Pranzo caldo con sapori di stagione.',
- L250: 'Attività invernali leggere o punti panoramici.',
- L251: 'Pranzo al caldo prima di rientrare.',
- L259: name: 'Castel di Sangro',
- L263: timeHint: 'Sosta più lunga, spesso in fascia pranzo',
- L264: desc: "Città dell'acqua e della pesca a mosca, nodo cruciale dell'Alta Valle del Sangro.",
- L270: mealTip: 'Se sei in fascia pranzo, punta a una trattoria vicino al centro.',
- L273: 'Passeggiata nel centro e foto lungo il corso.',
- L277: 'Passeggiata serale e gelato.',
- L281: 'Sapori locali e botteghe.',
- L282: 'Passeggiata tra vicoli e scorci.',
- L285: 'Centro storico e locali al chiuso.',
- L286: 'Bevanda calda e pausa rilassante.',
- L294: mealTip: 'Con una sosta lunga puoi pranzare senza fretta.',
- L297: 'Giro completo tra centro e aree verdi.',
- L298: 'Pranzo rilassato e passeggiata finale.',
- L301: 'Pausa lunga con pranzo e passeggiata.',
- L305: 'Percorso lento tra i colori e botteghe.',
- L306: 'Pranzo caldo con prodotti locali.',
- L309: 'Pranzo al caldo e visita tranquilla.',
- L310: 'Sosta in caffetteria prima del rientro.',
- L471: Seleziona la stagione e scopri cosa fare nelle città in cui il treno si ferma,
- L472: con suggerimenti calibrati sulla durata della sosta.

## src/pages/Fermate.jsx
- L13: desc: 'La città dei confetti e di Ovidio. Punto di partenza dell\'itinerario storico.',
- L19: name: 'Campo di Giove',
- L20: viaggiaName: 'Campo di Giove',
- L24: desc: 'Ai piedi della Majella, incorniciata da fitti boschi e paesaggi mozzafiato.',
- L25: photo: '/photos/fermate/campo-di-giove.webp',
- L35: desc: 'Stazione isolata nel Quarto Santa Chiara, regno della natura selvaggia.',
- L46: desc: 'La stazione più alta della linea, rinomata per il turismo montano invernale ed estivo.',
- L52: name: 'Castel di Sangro',
- L53: viaggiaName: 'Castel di Sangro',
- L57: desc: 'Città dell\'acqua e della pesca a mosca, nodo cruciale dell\'Alta Valle del Sangro.',
- L58: photo: '/photos/fermate/castel-di-sangro.webp',
- L76: origin: 'Campo di Giove',
- L182: Esplora le stazioni storiche lungo la ferrovia più alta e panoramica d'Italia, un nastro d'acciaio che cuce parchi nazionali e riserve naturali.

## src/pages/Home.jsx
- L34: alt: 'Parco Nazionale della Maiella',
- L39: alt: 'Parco Nazionale d’Abruzzo, Lazio e Molise',
- L100: Un'esperienza autentica a bordo di carrozze d'epoca. Attraversa i Parchi Nazionali e i borghi più belli dell'Appennino Centrale.
- L123: <span>Scorri per iniziare il viaggio</span>
- L138: alt="Treno storico che attraversa un viadotto immerso nella vegetazione delle montagne abruzzesi"
- L186: aria-label="Partner e sponsor della Transiberiana d'Abruzzo"

## src/pages/InfoUtili.jsx
- L9: { q: "Il treno è riscaldato in inverno?", a: "Sì, tutte le carrozze d'epoca sono dotate di riscaldamento a vapore e termosifoni originali restaurati e funzionanti." },
- L10: { q: "Posso portare il mio cane a bordo?", a: "I cani di piccola taglia sono ammessi gratuitamente all'interno dell'apposito trasportino. I cani di taglia superiore necessitano di un biglietto dedicato." },
- L11: { q: "Ci sono toilette a bordo?", a: "Sì, sebbene siano le originali degli anni '30. Suggeriamo di usufruire dei bagni presenti nelle stazioni di sosta per maggiore comodità." },
- L12: { q: "fius sta male?", a: "Assolutamente sì. Non è presente una carrozza ristorante, quindi il pranzo al sacco è benvenuto, specialmente da consumare durante le soste lunghe nei borghi." },
- L13: { q: "Stai male?", a: "Chiama il 112" },
- L14: { q: "Stai male?", a: "Chiama il 112" },
- L15: { q: "Stai male?", a: "Chiama il 112" },
- L16: { q: "Stai male?", a: "Chiama il 112" }
- L29: Tutto quello che c'è da sapere prima di imbarcarsi in questa avventura retrò tra le montagne abruzzesi.
- L37: aria-label="Apri le recensioni su TripAdvisor (si apre in una nuova scheda)"
- L58: I treni storici richiedono attenzione. Non sporgersi dai finestrini durante la marcia, non gettare rifiuti dal treno, e mantenere comportamenti rispettosi dei materiali d'epoca e degli altri viaggiatori.
- L70: transition={{ delay: i * 0.1, type: 'spring', stiffness: 120, damping: 22 }}

## src/pages/Journey.jsx
- L11: { id: 1, name: 'Sulmona', alt: '328m', type: 'Partenza', desc: "La città dei confetti e di Ovidio. Punto di partenza dell'itinerario storico." },
- L12: { id: 2, name: 'Campo di Giove', alt: '1.064m', type: 'Sosta', desc: 'Ai piedi della Majella, incorniciata da fitti boschi e paesaggi mozzafiato.' },
- L13: { id: 3, name: 'Palena', alt: '1.258m', type: 'Punto panoramico', desc: 'Stazione isolata nel Quarto Santa Chiara, regno della natura selvaggia.' },
- L14: { id: 4, name: 'Roccaraso', alt: '1.268m', type: 'Sosta', desc: 'La stazione più alta della linea, rinomata per il turismo montano invernale ed estivo.' },
- L15: { id: 5, name: 'Castel di Sangro', alt: '793m', type: 'Capolinea', desc: "Città dell'acqua e della pesca a mosca, nodo cruciale dell'Alta Valle del Sangro." }
- L199: setFormStatus({ error: 'Inserisci la tua email per proseguire.', success: '' });
- L204: setFormStatus({ error: 'Inserisci un indirizzo email valido.', success: '' });
- L216: success: 'Grazie! Ti avviseremo appena aprono le prenotazioni.',
- L246: Un secolo di <span className="italic text-primary/70">storia</span> attraverso gli Appennini
- L254: Progettata a fine Ottocento, la ferrovia Sulmona-Isernia è un capolavoro di ingegneria civile che ha unito le popolazioni montane prima di diventare la linea turistica più iconica d'Italia.
- L261: <TimelineItem year="1892" title="L'inizio dei lavori" desc="Iniziano i lavori per la costruzione della Sulmona-Isernia. La sfida ingegneristica è colossale: bisogna superare dislivelli enormi scavando gallerie nella roccia viva dell'Appennino." reverse={false} imageId="1474487548417-781cb71495f3" stepId="storia-1892" reduceMotion={reduceMotion} />
- L262: <TimelineItem year="1897" title="L'inaugurazione" desc="Viene inaugurato il tratto fino a Cansano e Campo di Giove. La ferrovia diventa subito il principale mezzo di trasporto per merci e persone tra l'Abruzzo e il Molise." reverse={true} imageId="1506260408121-e353d10b87c7" stepId="storia-1897" reduceMotion={reduceMotion} />
- L263: <TimelineItem year="1943" title="Distruzione e rinascita" desc="Durante la Seconda Guerra Mondiale la linea subisce gravissimi danni a causa della Linea Gustav. Negli anni '50 viene ricostruita e ammodernata, riprendendo il suo ruolo di collante vitale." reverse={false} imageId="1475924156734-496f6cac6ec1" stepId="storia-1943" reduceMotion={reduceMotion} />
- L264: <TimelineItem year="2011" title="La sospensione" desc="Il servizio ordinario passeggeri viene sospeso per via degli elevati costi di gestione. Si teme l'abbandono definitivo della linea storica." reverse={true} imageId="1465146344425-f00d5f5c8f07" stepId="storia-2011" reduceMotion={reduceMotion} />
- L265: <TimelineItem year="Oggi" title="La Transiberiana" desc="Rinata come ferrovia turistica grazie alla Fondazione FS Italiane, oggi offre l'esperienza magica di viaggiare su treni d'epoca attraverso i paesaggi immacolati dell'Appennino." reverse={false} imageId="1494515843206-f3117d3f51b7" stepId="storia-oggi" reduceMotion={reduceMotion} />
- L274: Le stazioni lungo il viaggio
- L277: Dopo la storia, il percorso prosegue tra borghi e altopiani: ogni fermata è una tappa da vivere con calma.
- L320: Lascia la tua email e ti avvisiamo appena aprono le prenotazioni per le prossime partenze.

## src/pages/Meteo.jsx
- L13: castel: '/photos/fermate/castel-di-sangro.webp',
- L14: campo: '/photos/fermate/campo-di-giove.webp',
- L118: {isDark ? 'Riscaldando i sensori...' : 'Raccogliendo i dati dai sensori...'}
- L122: <div key={i} className="w-2.5 h-2.5 rounded-full bg-primary/30 animate-gentle-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
- L136: ? 'I sensori della stazione dormono profondamente. Il gufo meteorologo sta sorvegliando. Riprova tra qualche minuto.'
- L137: : 'I sensori della stazione stanno dormendo. Riprova tra qualche minuto, il coniglietto meteorologo è al lavoro.'
- L157: ? 'La candela si è spenta, non riusciamo a raggiungere i sensori. Controlla la connessione e riprova.'
- L158: : 'Non riusciamo a raggiungere i sensori IoT. Controlla la connessione e riprova.'
- L252: <p className="text-lg text-muted-foreground max-w-[55ch]">Condizioni meteorologiche in tempo reale lungo la Transiberiana d'Abruzzo.</p>

## src/pages/NotFound.jsx
- L32: La pagina che stai cercando non esiste o è stata spostata. Puoi tornare alla home e riprendere il viaggio.

## src/pages/Storia.jsx
- L25: Un secolo di <span className="italic text-primary/70">storia</span> attraverso gli Appennini
- L33: Progettata a fine Ottocento, la ferrovia Sulmona-Isernia è un capolavoro di ingegneria civile che ha unito le popolazioni montane prima di diventare la linea turistica più iconica d'Italia.

## src/sections/fermate.js
- L9: tag: 'Porta del Parco',
- L12: desc: 'Città natale di Ovidio e capitale dei confetti, Sulmona è la porta del Parco Nazionale della Majella. Stazione di partenza del treno storico, offre un centro storico medievale ricchissimo di arte e gastronomia.',
- L14: facts: ['🏛️ Centro medievale', '🍬 Capitale dei confetti', '🏔️ Parco Majella', '🚉 Stazione di partenza'],
- L21: name: 'Castel di Sangro',
- L22: tag: 'Cuore della rotta',
- L25: desc: 'A quasi 800 metri di quota, Castel di Sangro è il vero cuore della Transiberiana. Circondata da montagne e boschi di faggio, è una meta ideale per amanti della natura, dello sci e degli arrosticini.',
- L27: facts: ['⛷️ Comprensorio sciistico', '🥩 Arrosticini DOC', '🏰 Rocca Medievale', '🌲 Boschi di faggio'],
- L28: photo: '/photos/fermate/castel-di-sangro.webp',
- L35: name: 'Campo di Giove',
- L39: desc: 'Il borgo più alto della ferrovia, adagiato sull\'altopiano della Majella. D\'inverno diventa un paesaggio da fiaba, mentre in estate regala escursioni tra flora appenninica e panorami sconfinanti.',
- L42: photo: '/photos/fermate/campo-di-giove.webp',

## src/sections/journey.js
- L63: popupImg.alt = `Foto della stazione di ${s.name}`;

## src/sections/meteo.js
- L19: const STATION_NAMES = { sulmona: 'Sulmona', castel: 'Castel di Sangro', campo: 'Campo di Giove' };
- L75: ? 'Nessun dato dall’API: apri il sito tramite server (es. `npm run dev`).'
- L76: : 'Nessun dato dall’API (temporaneamente non raggiungibile).';
- L111: } catch (e) { console.warn('Current conditions fetch failed:', e); }
- L211: tbody.innerHTML = rows.length ? rows.join('') : `<tr><td colspan="4" class="stats-loading">Seleziona almeno una misura.</td></tr>`;

## src/stats/calculator.js
- L25: return a.reduce((s, v) => s + v, 0) / a.length;
- L39: : (a[mid - 1] + a[mid]) / 2;
- L69: return a.length ? Math.min(...a) : null;
- L73: return a.length ? Math.max(...a) : null;
- L79: * @param {string} unit  e.g. '°C', '%', 'hPa'

## src/style.css
- L5: --border: #e5e4e7;
- L38: --border: #2e303a;