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
    experience: {
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
            'Sulmona è famosa in tutta Italia per la produzione dei confetti, dolci a base di mandorla ricoperta di zucchero realizzati artigianalmente e spesso disposti in composizioni decorative a forma di fiore. La cucina locale comprende anche piatti a base di legumi come lenticchie e ceci, maccheroni alla chitarra, carni di agnello e pecora e dolci tipici come torcinelli e calcionetti abruzzesi.',
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
      gallery: [
        {
          id: 'aq1',
          src: '/photos/storia/sulmona.webp',
          alt: 'Veduta di Sulmona con atmosfera urbana storica',
          caption: 'Acquedotto medievale e Piazza Garibaldi.',
        },
        {
          id: 'aq2',
          src: '/photos/storia/sulmona.webp',
          alt: 'Dettaglio placeholder per artigianato o architettura di Sulmona',
          caption: 'Confetti artigianali e composizioni decorative a forma di fiore.',
        },
        {
          id: 'aq3',
          src: '/photos/storia/sulmona.webp',
          alt: 'Placeholder per scena di piazza o rito pubblico a Sulmona',
          caption: 'Tradizioni cittadine e celebrazioni pubbliche.',
        },
      ],
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
    },
  },
  {
    id: 2,
    label: 'Capitolo 02',
    title: 'Campo di Giove',
    summary: "Borgo di montagna nel Parco della Majella, tra faggete, pietra e grandi panorami d'Appennino.",
    story:
      "Nel cuore della Majella, Campo di Giove nasce su percorsi antichi legati a commercio e transumanza. Ricostruito dopo il terremoto del 1706, oggi tiene insieme memoria storica, paesaggio montano e l'identità lenta della Ferrovia dei Parchi.",
    image: '/photos/storia/campo-di-giove.webp',
  },
  {
    id: 3,
    label: 'Capitolo 03',
    title: 'Palena',
    summary: "Borgo montano vicino al valico della Forchetta, a ridosso di uno dei tratti più panoramici della linea.",
    story:
      "Palena si sviluppa attorno a una fortificazione medievale affacciata sulla valle dell'Aventino. Oggi unisce castello ducale, museo geopaleontologico e natura della Majella lungo uno dei passaggi più scenografici della Sulmona-Isernia.",
    image: '/photos/storia/palena.webp',
  },
  {
    id: 4,
    label: 'Capitolo 04',
    title: 'Roccaraso',
    summary: "La soglia alpina della linea e il principale accesso agli impianti e ai paesaggi dell'Alto Sangro.",
    story:
      "Roccaraso è una delle icone del turismo montano abruzzese. Sulla ferrovia segna il passaggio a un paesaggio alto, aperto e luminoso, frequentato in inverno per la neve e in estate per l'aria fresca, i boschi e gli altipiani.",
    image: '/photos/storia/roccaraso.webp',
  },
  {
    id: 5,
    label: 'Capitolo 05',
    title: 'Castel di Sangro',
    summary: "Centro dell'Alto Sangro tra strade medievali, collezioni d'arte e una forte vocazione turistica.",
    story:
      'Nata come presidio sulle vie tra Abruzzo e Molise, Castel di Sangro conserva un centro storico di pietra, la Basilica di Santa Maria Assunta, il Museo Civico Aufidenate e la Pinacoteca Patiniana. Oggi resta un nodo culturale e turistico della valle.',
    image: '/photos/storia/castel-di-sangro.webp',
  },
];

export default storiaStops;
