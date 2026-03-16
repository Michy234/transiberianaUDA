const createGallery = (prefix, src, items) =>
  items.map((item, index) => ({
    id: `${prefix}${index + 1}`,
    src,
    ...item,
  }));

const sulmonaExperience = {
  eyebrow: 'Sulmona',
  intro:
    'Città della Valle Peligna con origini preromane e romane, famosa per i confetti artigianali e per l’acquedotto medievale con 21 arcate.',
  body:
    'Il borgo conserva chiese e palazzi storici e ogni anno ospita eventi culturali e tradizionali che celebrano la sua storia e l’artigianato locale.',
  quote: 'Sulmona unisce storia antica, tradizioni popolari, gastronomia e patrimonio artistico.',
  heroBadges: ['Valle Peligna', 'San Panfilo', '21 arcate medievali', 'Confetti artigianali'],
  stats: [
    { label: 'Origini', value: 'Peligni e municipium romano' },
    { label: 'Patrono', value: 'San Panfilo' },
    { label: 'Monumenti', value: 'Acquedotto medievale e Piazza Garibaldi' },
    { label: 'Tradizioni', value: 'Giostra Cavalleresca e Madonna che Scappa in Piazza' },
  ],
  chapters: [
    {
      id: 'radici',
      title: 'Origini',
      body:
        'In epoca preromana il territorio era abitato dal popolo italico dei Peligni. Con la conquista romana la città divenne un municipium e si sviluppò grazie alla sua posizione strategica tra l’Adriatico e l’interno dell’Appennino.',
      pullout: 'Qui nacque Publio Ovidio Nasone, uno dei più importanti autori della letteratura romana.',
      callouts: ['Popolo dei Peligni', 'Municipium romano', 'Nascita di Publio Ovidio Nasone'],
    },
    {
      id: 'patrono-monumenti',
      title: 'Patrono e monumenti',
      body:
        'Il simbolo della città è l’Acquedotto medievale di Sulmona, costruito nel XIII secolo e formato da una lunga serie di arcate che attraversano Piazza Garibaldi, la piazza principale. Tra gli edifici religiosi più importanti si trova la Cattedrale di San Panfilo, dedicata al patrono della città, insieme a numerose chiese storiche e palazzi antichi.',
      pullout: 'Il centro storico conserva monumenti e testimonianze artistiche tra i più rappresentativi della città.',
      callouts: ['San Panfilo', 'Cattedrale di San Panfilo', 'Acquedotto medievale', 'Piazza Garibaldi'],
    },
    {
      id: 'riti',
      title: 'Tradizioni',
      body:
        'Tra le tradizioni più importanti c’è la Giostra Cavalleresca di Sulmona, una rievocazione storica che si svolge ogni estate e vede i cavalieri dei vari quartieri della città sfidarsi in un torneo ispirato al Medioevo. Un’altra celebrazione molto famosa è la Madonna che Scappa in Piazza, che si svolge la mattina di Pasqua.',
      pullout: 'Ogni anno la città ospita eventi culturali e tradizionali che ne celebrano la storia e l’artigianato locale.',
      callouts: ['Giostra Cavalleresca', 'Madonna che Scappa in Piazza', 'Celebrazioni cittadine'],
    },
    {
      id: 'sapori',
      title: 'Sapori',
      body:
        'Sulmona è famosa in tutta Italia per la produzione dei confetti, dolci a base di mandorla ricoperta di zucchero realizzati artigianalmente e spesso disposti in composizioni decorative a forma di fiore. La cucina locale comprende anche piatti a base di legumi come lenticchie e ceci, maccheroni alla chitarra, carni di agnello e pecora e dolci tipici abruzzesi, come torcinelli e calcionetti abruzzesi.',
      pullout: 'Questi sapori riflettono una tradizione rurale che combina semplicità, ingredienti locali e tecniche di preparazione antiche.',
      callouts: ['Confetti artigianali', 'Maccheroni alla chitarra', 'Agnello e pecora', 'Torcinelli e calcionetti'],
    },
    {
      id: 'posizione',
      title: 'Posizione',
      body:
        'Grazie alla sua posizione nella Valle Peligna e alla vicinanza con montagne e parchi naturali dell’Appennino, Sulmona è oggi anche un importante punto di partenza per escursioni e turismo naturalistico.',
      pullout: 'La posizione tra Valle Peligna e Appennino rende Sulmona una tappa naturale tra città, montagne e percorsi nel paesaggio.',
      callouts: ['Valle Peligna', 'Montagne dell’Appennino', 'Escursioni e turismo naturalistico'],
    },
  ],
  gallery: createGallery('sulmona-', '/photos/storia/sulmona.webp', [
    {
      alt: 'Veduta di Sulmona con atmosfera urbana storica',
      caption: 'Acquedotto medievale e Piazza Garibaldi.',
    },
    {
      alt: 'Dettaglio placeholder per artigianato o architettura di Sulmona',
      caption: 'Confetti artigianali e composizioni decorative a forma di fiore.',
    },
    {
      alt: 'Placeholder per scena di piazza o rito pubblico a Sulmona',
      caption: 'Tradizioni cittadine e celebrazioni pubbliche.',
    },
  ]),
  rituals: [
    {
      title: 'Giostra Cavalleresca',
      tag: 'Estate',
      desc: 'Rievocazione storica estiva in cui i cavalieri dei quartieri della città si sfidano in un torneo ispirato al Medioevo.',
    },
    {
      title: 'Madonna che Scappa in Piazza',
      tag: 'Pasqua',
      desc: 'Celebrazione pasquale in cui la statua della Madonna corre incontro alla statua del Cristo risorto tra la folla radunata nella piazza.',
    },
    {
      title: 'Confetti artigianali',
      tag: 'Identità',
      desc: 'Tradizione artigianale antica legata a mandorle ricoperte di zucchero e a composizioni decorative a forma di fiore.',
    },
  ],
  closing: {
    title: 'Storia, tradizioni, gastronomia e territorio',
    body:
      'Sulmona unisce storia antica, tradizioni popolari, gastronomia e patrimonio artistico, che la rendono uno dei centri culturali più interessanti d’Abruzzo.',
  },
};

const campoDiGioveExperience = {
  eyebrow: 'Campo di Giove',
  intro:
    'Borgo montano del Parco della Majella, a circa 1100 metri di altitudine, tra faggete, sentieri e paesaggi d’Appennino.',
  body:
    'Campo di Giove ha origini medievali e si sviluppò come centro di montagna legato alla transumanza. Oggi conserva strade lastricate, case in pietra, piccole piazze e una forte vocazione naturalistica.',
  quote: 'Campo di Giove unisce memoria montana, tradizioni locali e paesaggi della Majella.',
  heroBadges: ['Parco della Majella', 'Circa 1100 metri', 'Transumanza', 'Faggete e trekking'],
  stats: [
    { label: 'Origini', value: 'Borgo medievale di montagna' },
    { label: 'Paesaggio', value: 'Majella, faggete e sentieri' },
    { label: 'Monumenti', value: 'Chiesa di San Vincenzo e pietra locale' },
    { label: 'Tradizioni', value: 'Feste patronali, processioni e fiere' },
  ],
  chapters: [
    {
      id: 'origini',
      title: 'Origini',
      body:
        'Campo di Giove ha origini medievali e si sviluppò come centro montano lungo percorsi legati al commercio e alla transumanza. La sua storia è strettamente legata alla vita pastorale e al paesaggio della Majella.',
      pullout: 'Il paese crebbe lungo itinerari di scambio e di pastorizia tra montagna e vallate.',
      callouts: ['Origini medievali', 'Transumanza', 'Vita pastorale'],
    },
    {
      id: 'monumenti',
      title: 'Centro storico e monumenti',
      body:
        'Il paese conserva strade lastricate, case in pietra e piccole piazze che mantengono il carattere del borgo montano. Tra gli edifici religiosi più importanti si trova la Chiesa di San Vincenzo, accanto a cappelle minori disseminate nel tessuto storico.',
      pullout: 'La trama urbana conserva la misura raccolta dei centri montani della Majella.',
      callouts: ['Strade lastricate', 'Case in pietra', 'Chiesa di San Vincenzo', 'Cappelle minori'],
    },
    {
      id: 'tradizioni',
      title: 'Tradizioni',
      body:
        'La vita del paese è scandita da feste patronali, processioni e fiere locali che mantengono vivi i momenti di incontro della comunità. Queste ricorrenze accompagnano il calendario civile e religioso del borgo.',
      pullout: 'Il calendario locale tiene insieme devozione, incontro pubblico e memoria del paese.',
      callouts: ['Feste patronali', 'Processioni', 'Fiere locali'],
    },
    {
      id: 'sapori',
      title: 'Sapori',
      body:
        'La cucina locale comprende formaggi di pecora e capra, salumi, miele e dolci montani. Tra i piatti più diffusi compaiono maccheroni fatti in casa, gnocchi, zuppe di legumi, arrosti di agnello e capra e pane cotto a legna.',
      pullout: 'La cucina di montagna nasce da allevamento, prodotti semplici e preparazioni domestiche.',
      callouts: ['Formaggi di pecora e capra', 'Maccheroni fatti in casa', 'Zuppe di legumi', 'Arrosti e pane a legna'],
    },
    {
      id: 'posizione',
      title: 'Posizione',
      body:
        'Grazie alla sua posizione nel Parco della Majella, Campo di Giove è oggi un punto di riferimento per trekking, passeggiate e itinerari naturalistici tra boschi e montagne.',
      pullout: 'Majella, faggete e sentieri fanno del paese una porta naturale verso l’escursionismo.',
      callouts: ['Parco della Majella', 'Trekking', 'Itinerari naturalistici'],
    },
  ],
  gallery: createGallery('campo-di-giove-', '/photos/storia/campo-di-giove.webp', [
    {
      alt: 'Veduta montana di Campo di Giove nel Parco della Majella',
      caption: 'Paesaggio montano e faggete del Parco della Majella.',
    },
    {
      alt: 'Dettaglio del tessuto storico di Campo di Giove',
      caption: 'Strade lastricate, case in pietra e piazze del borgo.',
    },
    {
      alt: 'Placeholder per tradizioni o cucina di Campo di Giove',
      caption: 'Tradizioni locali e cucina di montagna.',
    },
  ]),
  rituals: [
    {
      title: 'Feste patronali',
      tag: 'Calendario',
      desc: 'Le ricorrenze religiose raccolgono la comunità nei momenti principali dell’anno.',
    },
    {
      title: 'Processioni',
      tag: 'Rito',
      desc: 'Le processioni accompagnano le celebrazioni e mantengono viva la dimensione religiosa del paese.',
    },
    {
      title: 'Fiere locali',
      tag: 'Comunità',
      desc: 'Gli appuntamenti pubblici legano tradizione, incontro e vita del borgo montano.',
    },
  ],
  closing: {
    title: 'Majella, pietra e vita di montagna',
    body:
      'Campo di Giove conserva la memoria della transumanza, architetture in pietra, tradizioni locali e una forte vocazione per il paesaggio della Majella.',
  },
};

const palenaExperience = {
  eyebrow: 'Palena',
  intro:
    'Borgo montano legato alla Majella e agli Altipiani Maggiori, vicino al valico della Forchetta e a uno dei punti ferroviari più panoramici del percorso.',
  body:
    'Palena ha origini antiche e medievali e si sviluppò come centro pastorale e agricolo. Oggi mantiene un forte legame con la Chiesa di San Falco, con la sua stazione ferroviaria e con il paesaggio d’altura.',
  quote: 'Palena tiene insieme devozione, paesaggio montano e memoria ferroviaria.',
  heroBadges: ['Majella', 'San Falco', 'Altipiani Maggiori', 'Valico della Forchetta'],
  stats: [
    { label: 'Origini', value: 'Centro antico e medievale' },
    { label: 'Patrono', value: 'San Falco' },
    { label: 'Monumenti', value: 'Chiesa di San Falco e stazione' },
    { label: 'Paesaggio', value: 'Majella e Altipiani Maggiori' },
  ],
  chapters: [
    {
      id: 'origini',
      title: 'Origini',
      body:
        'Palena ha origini antiche e medievali e si sviluppò come centro di montagna legato alla pastorizia e all’agricoltura. La sua storia si intreccia con la vita dei pascoli, dei sentieri e delle attività rurali d’altura.',
      pullout: 'Il borgo nacque e crebbe dentro un’economia montana fatta di allevamento e lavoro agricolo.',
      callouts: ['Origini antiche', 'Età medievale', 'Pastorizia e agricoltura'],
    },
    {
      id: 'patrono-monumenti',
      title: 'Patrono e monumenti',
      body:
        'Tra i luoghi più importanti si trova la Chiesa di San Falco, legata al patrono della città. Un altro punto identitario è la stazione ferroviaria posta sugli Altipiani Maggiori, legata a uno dei tratti più panoramici del viaggio.',
      pullout: 'San Falco e la stazione raccontano la doppia identità religiosa e ferroviaria di Palena.',
      callouts: ['San Falco', 'Chiesa di San Falco', 'Stazione ferroviaria', 'Altipiani Maggiori'],
    },
    {
      id: 'tradizioni',
      title: 'Tradizioni',
      body:
        'La vita del borgo è ancora segnata da feste patronali, processioni e rievocazioni storiche che mantengono vivo il rapporto tra comunità, memoria religiosa e racconto del paese.',
      pullout: 'Le ricorrenze pubbliche rinnovano il legame tra la comunità e la sua storia.',
      callouts: ['Feste patronali', 'Processioni', 'Rievocazioni storiche'],
    },
    {
      id: 'sapori',
      title: 'Sapori',
      body:
        'Tra i sapori locali compaiono maccheroni fatti in casa, zuppe di legumi, arrosti, formaggi, miele e castagne. La tradizione dolciaria comprende zeppole montane, dolci alle mandorle e alle noci e pane cotto a legna.',
      pullout: 'La tavola di Palena riflette il paesaggio montano e i suoi prodotti più semplici e duraturi.',
      callouts: ['Maccheroni fatti in casa', 'Formaggi e miele', 'Castagne', 'Zeppole montane e pane a legna'],
    },
    {
      id: 'posizione',
      title: 'Posizione',
      body:
        'La vicinanza con la Majella, con gli altipiani e con i sentieri di montagna rende Palena un punto di partenza per escursioni, passeggiate e percorsi naturalistici d’altura.',
      pullout: 'Majella, altipiani e sentieri fanno di Palena una tappa di paesaggio e di respiro montano.',
      callouts: ['Majella', 'Altipiani', 'Escursioni e percorsi naturalistici'],
    },
  ],
  gallery: createGallery('palena-', '/photos/storia/palena.webp', [
    {
      alt: 'Veduta di Palena tra montagne e altipiani',
      caption: 'Palena tra Majella, altipiani e paesaggio ferroviario.',
    },
    {
      alt: 'Dettaglio placeholder per chiesa o stazione di Palena',
      caption: 'Chiesa di San Falco e memoria della stazione sugli Altipiani Maggiori.',
    },
    {
      alt: 'Placeholder per tradizioni o cucina di Palena',
      caption: 'Tradizioni locali e sapori del borgo montano.',
    },
  ]),
  rituals: [
    {
      title: 'Feste patronali',
      tag: 'Calendario',
      desc: 'Le celebrazioni patronali scandiscono i momenti più sentiti della vita del borgo.',
    },
    {
      title: 'Processioni',
      tag: 'Rito',
      desc: 'Le processioni mantengono viva la dimensione religiosa e pubblica della comunità.',
    },
    {
      title: 'Rievocazioni storiche',
      tag: 'Memoria',
      desc: 'Gli eventi storici riportano nel presente episodi e simboli della storia locale.',
    },
  ],
  closing: {
    title: 'Palena tra devozione e paesaggio',
    body:
      'Palena tiene insieme radici montane, fede locale, memoria ferroviaria e una cucina legata alla vita d’altura.',
  },
};

const roccarasoExperience = {
  eyebrow: 'Roccaraso',
  intro:
    'Località montana dell’Alto Sangro, nota per il turismo invernale e per le attività all’aria aperta che animano il paese anche nella stagione estiva.',
  body:
    'Roccaraso ha origini medievali e si sviluppò come centro montano legato al commercio. Oggi unisce architetture religiose e civili, tradizioni paesane e una forte vocazione turistica.',
  quote: 'Roccaraso unisce architetture montane, tradizioni paesane e turismo d’altura.',
  heroBadges: ['Alto Sangro', 'Santa Maria Assunta', 'Sport invernali', 'Trekking e mountain bike'],
  stats: [
    { label: 'Origini', value: 'Borgo medievale di montagna' },
    { label: 'Monumenti', value: 'Chiesa di Santa Maria Assunta' },
    { label: 'Tradizioni', value: 'Feste religiose e sagre' },
    { label: 'Turismo', value: 'Sci, trekking e mountain bike' },
  ],
  chapters: [
    {
      id: 'origini',
      title: 'Origini',
      body:
        'Roccaraso ha origini medievali e si sviluppò come centro di montagna legato ai traffici locali e alle attività del territorio. La sua crescita è connessa alla vita delle quote alte e ai percorsi dell’Alto Sangro.',
      pullout: 'La storia del paese nasce dall’incontro tra insediamento montano, scambi e vita d’altitudine.',
      callouts: ['Origini medievali', 'Centro montano', 'Commercio locale'],
    },
    {
      id: 'monumenti',
      title: 'Monumenti',
      body:
        'Tra gli edifici più importanti si trova la Chiesa di Santa Maria Assunta, accanto a palazzi nobiliari che testimoniano la storia urbana del paese. Questi luoghi definiscono il volto storico di Roccaraso.',
      pullout: 'Chiesa e palazzi raccontano il passaggio tra vita religiosa, civile e memoria architettonica.',
      callouts: ['Santa Maria Assunta', 'Palazzi nobiliari', 'Volto storico del paese'],
    },
    {
      id: 'tradizioni',
      title: 'Tradizioni',
      body:
        'Feste religiose e sagre paesane mantengono vivo il calendario comunitario di Roccaraso. In questi momenti trovano spazio anche i prodotti tipici, legati alla cultura locale e alla convivialità del paese.',
      pullout: 'Le ricorrenze del paese uniscono dimensione religiosa, incontro pubblico e prodotti del territorio.',
      callouts: ['Feste religiose', 'Sagre paesane', 'Prodotti tipici'],
    },
    {
      id: 'sapori',
      title: 'Sapori',
      body:
        'La cucina locale comprende pasta fatta in casa, zuppe, arrosti e stufati, formaggi e miele. Tra i dolci compaiono zeppole, crostate di frutta secca e pane cotto a legna, in una tavola legata alla montagna e alla stagionalità.',
      pullout: 'La cucina di Roccaraso nasce da ingredienti semplici, tempi lenti e sapori di montagna.',
      callouts: ['Pasta fatta in casa', 'Arrosti e stufati', 'Formaggi e miele', 'Zeppole e crostate'],
    },
    {
      id: 'posizione',
      title: 'Posizione',
      body:
        'Roccaraso occupa una posizione centrale nei paesaggi dell’Alto Sangro ed è oggi una delle principali basi per sport invernali, trekking estivo e percorsi in mountain bike.',
      pullout: 'La geografia dell’Alto Sangro fa di Roccaraso una tappa naturale per la montagna in tutte le stagioni.',
      callouts: ['Alto Sangro', 'Sport invernali', 'Trekking estivo', 'Mountain bike'],
    },
  ],
  gallery: createGallery('roccaraso-', '/photos/storia/roccaraso.webp', [
    {
      alt: 'Veduta di Roccaraso tra architettura e paesaggio montano',
      caption: 'Roccaraso tra centro montano e paesaggi dell’Alto Sangro.',
    },
    {
      alt: 'Dettaglio placeholder per architetture o monumenti di Roccaraso',
      caption: 'Chiesa di Santa Maria Assunta e presenze architettoniche del paese.',
    },
    {
      alt: 'Placeholder per sport o vita stagionale a Roccaraso',
      caption: 'Turismo di montagna tra inverno ed estate.',
    },
  ]),
  rituals: [
    {
      title: 'Feste religiose',
      tag: 'Calendario',
      desc: 'Le ricorrenze religiose mantengono viva la dimensione collettiva del paese.',
    },
    {
      title: 'Sagre paesane',
      tag: 'Comunità',
      desc: 'Le sagre uniscono incontro pubblico, cucina locale e identità di montagna.',
    },
    {
      title: 'Prodotti tipici',
      tag: 'Identità',
      desc: 'I prodotti del territorio accompagnano feste e momenti di convivialità locale.',
    },
  ],
  closing: {
    title: 'Roccaraso tra architettura e turismo',
    body:
      'Roccaraso intreccia storia montana, architetture locali, tradizioni paesane e attività legate alle stagioni dell’Alto Sangro.',
  },
};

const castelDiSangroExperience = {
  eyebrow: 'Castel di Sangro',
  intro:
    'Centro dell’Alto Sangro con origini fortificate, strade di pietra, monumenti religiosi e uno dei poli culturali più rilevanti della valle.',
  body:
    'Castel di Sangro nacque come nucleo medievale attorno al castello e si sviluppò come centro della valle. Oggi unisce vicoli, piazze, arte sacra, museo e attività culturali.',
  quote: 'Castel di Sangro intreccia memoria medievale, vita culturale e cucina dell’Alto Sangro.',
  heroBadges: ['Alta valle del Sangro', 'Santa Maria Assunta', 'Pinacoteca Patiniana', 'Centro storico di pietra'],
  stats: [
    { label: 'Origini', value: 'Nucleo fortificato medievale' },
    { label: 'Monumenti', value: 'Santa Maria Assunta e Pinacoteca' },
    { label: 'Tradizioni', value: 'Feste patronali e fiere locali' },
    { label: 'Sapori', value: 'Maccheroni alla chitarra e tacconelli' },
  ],
  chapters: [
    {
      id: 'origini',
      title: 'Origini',
      body:
        'Castel di Sangro nacque come insediamento fortificato medievale sviluppato attorno al castello. Da questo nucleo si strutturò il centro della valle, punto di passaggio e di vita urbana nell’Alto Sangro.',
      pullout: 'Il primo impianto del paese è legato alla funzione difensiva e di controllo del territorio.',
      callouts: ['Origini medievali', 'Castello', 'Insediamento fortificato'],
    },
    {
      id: 'monumenti',
      title: 'Monumenti e centro storico',
      body:
        'Il centro storico conserva vicoli, piazze e architetture in pietra che definiscono il volto del paese. Tra i luoghi più importanti figurano la Chiesa di Santa Maria Assunta e la Pinacoteca Patiniana, riferimento culturale della città.',
      pullout: 'Tra vicoli di pietra e luoghi d’arte, il centro racconta il ruolo urbano di Castel di Sangro.',
      callouts: ['Vicoli e piazze', 'Architetture in pietra', 'Santa Maria Assunta', 'Pinacoteca Patiniana'],
    },
    {
      id: 'tradizioni',
      title: 'Tradizioni',
      body:
        'La vita del paese è accompagnata da feste patronali, rievocazioni storiche e fiere locali che rinnovano la memoria collettiva e il rapporto con il territorio.',
      pullout: 'Le ricorrenze pubbliche tengono insieme identità civica, storia locale e partecipazione della comunità.',
      callouts: ['Feste patronali', 'Rievocazioni storiche', 'Fiere locali'],
    },
    {
      id: 'sapori',
      title: 'Sapori',
      body:
        'La cucina locale comprende maccheroni alla chitarra con sugo di agnello o cinghiale, tacconelli, pecorini, guanciale e altri salumi. Tra i dolci compaiono zeppole di ricotta e castagne, insieme a pane e miele del territorio.',
      pullout: 'La tavola di Castel di Sangro tiene insieme paste tradizionali, carni, formaggi e dolci della valle.',
      callouts: ['Maccheroni alla chitarra', 'Tacconelli', 'Pecorini e salumi', 'Zeppole, pane e miele'],
    },
    {
      id: 'posizione',
      title: 'Posizione',
      body:
        'La posizione nell’alta valle del Sangro e la vicinanza alle montagne fanno di Castel di Sangro un centro di riferimento per il turismo e per la vita culturale della valle.',
      pullout: 'Tra valle, montagna e città, Castel di Sangro mantiene un ruolo di cerniera nel territorio.',
      callouts: ['Alta valle del Sangro', 'Vicinanza alle montagne', 'Vocazione turistica'],
    },
  ],
  gallery: createGallery('castel-di-sangro-', '/photos/storia/castel-di-sangro.webp', [
    {
      alt: 'Veduta di Castel di Sangro tra architetture e valle',
      caption: 'Centro storico di pietra e paesaggio dell’Alto Sangro.',
    },
    {
      alt: 'Dettaglio placeholder per monumenti o collezioni di Castel di Sangro',
      caption: 'Santa Maria Assunta e Pinacoteca Patiniana.',
    },
    {
      alt: 'Placeholder per tradizioni o cucina di Castel di Sangro',
      caption: 'Tradizioni locali e cucina della valle.',
    },
  ]),
  rituals: [
    {
      title: 'Feste patronali',
      tag: 'Calendario',
      desc: 'Le feste patronali continuano a segnare il ritmo pubblico della città.',
    },
    {
      title: 'Rievocazioni storiche',
      tag: 'Memoria',
      desc: 'Gli eventi rievocativi riportano al centro episodi e atmosfere della storia locale.',
    },
    {
      title: 'Fiere locali',
      tag: 'Comunità',
      desc: 'Le fiere mantengono vivo il rapporto tra città, territorio e produzione locale.',
    },
  ],
  closing: {
    title: 'Castel di Sangro tra cultura e valle',
    body:
      'Castel di Sangro conserva origini medievali, luoghi d’arte, tradizioni cittadine e una cucina che riflette il paesaggio dell’Alto Sangro.',
  },
};

const iserniaExperience = {
  eyebrow: 'Isernia',
  intro:
    'Città antica del Molise, nota per il sito paleolitico di Isernia La Pineta e per il centro storico con chiese, palazzi, musei e fontane monumentali.',
  body:
    'Isernia attraversa le epoche sannita, romana e medievale e oggi mantiene un ruolo strategico dal punto di vista culturale e amministrativo, insieme a una forte identità artigianale e gastronomica.',
  quote: 'Isernia unisce radici millenarie, monumenti, tradizioni e sapori del Molise interno.',
  heroBadges: ['Isernia La Pineta', 'Fontana Fraterna', 'San Pietro Apostolo', 'Molise interno'],
  stats: [
    { label: 'Origini', value: 'Paleolitico, Sanniti e Roma' },
    { label: 'Monumenti', value: 'Fontana Fraterna e Cattedrale' },
    { label: 'Tradizioni', value: 'Settimana Santa e festa di San Pietro' },
    { label: 'Sapori', value: 'Cavatelli, salumi e dolci al miele' },
  ],
  chapters: [
    {
      id: 'origini',
      title: 'Origini',
      body:
        'Isernia affonda le sue radici nel Paleolitico, come testimonia il sito di Isernia La Pineta. Alla fase più antica seguono le epoche sannita e romana, mentre nel Medioevo la città si sviluppò come centro religioso e commerciale.',
      pullout: 'Dalla preistoria al Medioevo, Isernia conserva una delle stratificazioni storiche più ampie del percorso.',
      callouts: ['Isernia La Pineta', 'Epoca sannita', 'Età romana', 'Sviluppo medievale'],
    },
    {
      id: 'monumenti',
      title: 'Monumenti e centro storico',
      body:
        'Tra i luoghi più importanti si trovano la Cattedrale di San Pietro Apostolo, la Chiesa di San Francesco, Palazzo San Francesco, la Fontana Fraterna e Piazza Andrea d’Isernia. Questi spazi definiscono l’identità urbana della città.',
      pullout: 'Cattedrale, fontana, palazzi e piazze compongono il profilo storico del centro cittadino.',
      callouts: ['San Pietro Apostolo', 'San Francesco', 'Palazzo San Francesco', 'Fontana Fraterna', 'Piazza Andrea d’Isernia'],
    },
    {
      id: 'tradizioni',
      title: 'Tradizioni',
      body:
        'Tra le tradizioni più sentite compaiono le processioni della Settimana Santa, la festa di San Pietro e le sagre estive. A queste si affiancano artigianato del ferro, tessuti e mercati che mantengono vivo il carattere cittadino.',
      pullout: 'Le tradizioni di Isernia intrecciano devozione, mercati e saperi artigianali.',
      callouts: ['Settimana Santa', 'Festa di San Pietro', 'Sagre estive', 'Artigianato e mercati'],
    },
    {
      id: 'sapori',
      title: 'Sapori',
      body:
        'La cucina locale comprende cavatelli con cime di rapa o sugo di salsiccia, gnocchi di patate e ricotta, tagliatelle al ragù di agnello o capra, pecorino molisano, soppressata e capocollo. Tra i dolci compaiono frittelle di ricotta, zeppole, biscotti di mandorle e miele, pane casereccio e miele di montagna.',
      pullout: 'La tavola di Isernia unisce paste tradizionali, salumi, latticini e dolci del Molise interno.',
      callouts: ['Cavatelli', 'Gnocchi di patate e ricotta', 'Pecorino, soppressata e capocollo', 'Frittelle, zeppole e miele'],
    },
    {
      id: 'ruolo',
      title: 'Ruolo attuale',
      body:
        'Oggi Isernia è una città strategica dal punto di vista culturale e amministrativo. La sua identità contemporanea tiene insieme storia millenaria, architettura medievale e barocca, tradizioni vive e gastronomia.',
      pullout: 'Nel presente Isernia si riconosce come città di storia, funzioni urbane e memoria diffusa.',
      callouts: ['Ruolo culturale', 'Funzione amministrativa', 'Architettura medievale e barocca'],
    },
  ],
  gallery: createGallery('isernia-', '/photos/storia/transiberiana.webp', [
    {
      alt: 'Placeholder panoramico per Isernia',
      caption: 'Isernia tra storia urbana, monumenti e memoria del percorso.',
    },
    {
      alt: 'Placeholder per monumenti o fontane di Isernia',
      caption: 'Fontana Fraterna, cattedrale e centro storico.',
    },
    {
      alt: 'Placeholder per tradizioni o cucina di Isernia',
      caption: 'Tradizioni, artigianato e sapori della città.',
    },
  ]),
  rituals: [
    {
      title: 'Settimana Santa',
      tag: 'Rito',
      desc: 'Le processioni della Settimana Santa sono tra i momenti più sentiti del calendario cittadino.',
    },
    {
      title: 'Festa di San Pietro',
      tag: 'Calendario',
      desc: 'La festa dedicata a San Pietro accompagna uno degli appuntamenti religiosi più riconoscibili della città.',
    },
    {
      title: 'Mercati e artigianato',
      tag: 'Identità',
      desc: 'Ferro, tessuti e mercati mantengono viva la tradizione artigianale e commerciale di Isernia.',
    },
  ],
  closing: {
    title: 'Isernia tra preistoria e città storica',
    body:
      'Isernia unisce il sito paleolitico, i monumenti del centro, le tradizioni cittadine e una cucina che racconta il Molise interno.',
  },
};

const storiaStops = [
  {
    id: 1,
    label: 'Capitolo 01',
    title: 'Sulmona',
    summary:
      'Città medievale della Valle Peligna famosa per i confetti artigianali e per l’acquedotto medievale con 21 arcate che attraversa il centro storico.',
    story:
      'La città di Sulmona ha origini molto antiche. In epoca preromana il territorio era abitato dal popolo italico dei Peligni e con la conquista romana divenne un municipium. Oggi conserva un centro storico ricco di monumenti, tradizioni popolari, gastronomia e testimonianze artistiche.',
    image: '/photos/storia/sulmona.webp',
    experience: sulmonaExperience,
  },
  {
    id: 2,
    label: 'Capitolo 02',
    title: 'Campo di Giove',
    summary:
      'Borgo montano nel Parco della Majella, a circa 1100 metri di altitudine, tra faggete, sentieri e grandi panorami d’Appennino.',
    story:
      'Campo di Giove ha origini medievali e si sviluppò come centro montano legato alla transumanza e ai percorsi commerciali. Oggi conserva architetture in pietra, ricorrenze locali e un forte rapporto con il paesaggio della Majella.',
    image: '/photos/storia/campo-di-giove.webp',
    experience: campoDiGioveExperience,
  },
  {
    id: 3,
    label: 'Capitolo 03',
    title: 'Palena',
    summary:
      'Borgo montano vicino al valico della Forchetta, tra Majella, Altipiani Maggiori e uno dei punti ferroviari più panoramici del percorso.',
    story:
      'Palena ha origini antiche e medievali e si sviluppò come centro pastorale e agricolo. Oggi mantiene il legame con San Falco, con la stazione ferroviaria e con il paesaggio d’altura che circonda il paese.',
    image: '/photos/storia/palena.webp',
    experience: palenaExperience,
  },
  {
    id: 4,
    label: 'Capitolo 04',
    title: 'Roccaraso',
    summary:
      'Località montana dell’Alto Sangro, tra sport invernali, sentieri estivi e paesaggi aperti d’altitudine.',
    story:
      'Roccaraso ha origini medievali e si sviluppò come centro di montagna legato al commercio e alle attività del territorio. Oggi è una delle principali località turistiche dell’Appennino, frequentata in inverno e in estate.',
    image: '/photos/storia/roccaraso.webp',
    experience: roccarasoExperience,
  },
  {
    id: 5,
    label: 'Capitolo 05',
    title: 'Castel di Sangro',
    summary:
      'Centro dell’Alto Sangro tra origini fortificate, strade di pietra, luoghi d’arte e una forte vocazione culturale.',
    story:
      'Castel di Sangro nacque come insediamento fortificato medievale attorno al castello e si sviluppò come centro della valle. Oggi conserva vicoli, piazze, monumenti religiosi e una forte vita culturale.',
    image: '/photos/storia/castel-di-sangro.webp',
    experience: castelDiSangroExperience,
  },
  {
    id: 6,
    label: 'Capitolo 06',
    title: 'Isernia',
    summary:
      'Città antica del Molise, tra il sito paleolitico di Isernia La Pineta, monumenti storici e una forte identità cittadina.',
    story:
      'Isernia affonda le sue radici nel Paleolitico e attraversa le epoche sannita, romana e medievale. Oggi è un centro culturale e amministrativo che unisce monumenti, tradizioni, artigianato e gastronomia.',
    image: '/photos/storia/transiberiana.webp',
    experience: iserniaExperience,
  },
];

export default storiaStops;
