import { FlowerLotus, Sun, Leaf, Snowflake } from '@phosphor-icons/react';

export const DEFAULT_ACTIVITY_SEASONS = [
  { key: 'spring', label: 'Primavera', range: 'Mar-Mag', icon: FlowerLotus },
  { key: 'summer', label: 'Estate', range: 'Giu-Ago', icon: Sun },
  { key: 'autumn', label: 'Autunno', range: 'Set-Nov', icon: Leaf },
  { key: 'winter', label: 'Inverno', range: 'Dic-Feb', icon: Snowflake },
];

export const DEFAULT_ACTIVITY_SEASON_COPY = {
  spring: 'Borghi, prati e luce lunga: la stagione migliore per allungare le passeggiate.',
  summer: 'Ore centrali più intense, ma aria di montagna e ombra rendono le soste piacevoli.',
  autumn: 'Foliage, prodotti tipici e luce morbida: il viaggio diventa più narrativo e gastronomico.',
  winter: 'Neve, interni caldi e scorci iconici: conviene alternare panorama e luoghi riparati.',
};

export const DEFAULT_ACTIVITY_STOPS = [
  {
    id: 1,
    name: 'Sulmona',
    alt: '328m',
    type: 'Partenza',
    stopDuration: '60-120 min',
    timeHint: 'Ideale prima della partenza o al rientro, con percorsi diversi a seconda della luce.',
    desc: "La città dei confetti e di Ovidio: prima porta del viaggio e ritorno naturale per chiudere la giornata tra piazze, musei e botteghe.",
    heroImage: '/photos/storia/sulmona.webp',
    heroAlt: "Panorama di Sulmona con il centro storico ai piedi delle montagne d'Abruzzo.",
    schedule: {
      arrival: '08:45-09:00',
      departure: '18:30-19:00',
      duration: '60-120 min nel centro storico',
      note: "Gli orari sono indicativi: al mattino conviene restare compatti, al rientro funzionano meglio portici, musei e una cena nel centro.",
    },
    seasonContext: {
      spring: "Luce chiara e clima mite: Sulmona invita a muoversi tra piazze, acquedotto e tavolini all'aperto.",
      summer: "Le visite rendono di più tra tardo pomeriggio e sera, cercando ombra tra Corso Ovidio, Porta Napoli e Piazza XX Settembre.",
      autumn: "Musei, botteghe e prodotti simbolo come confetti e aglio rosso raccontano la città con un ritmo più lento.",
      winter: "Quando il treno rientra è già buio, i portici di Corso Ovidio, l'Annunziata e le vetrine illuminate diventano la scelta migliore.",
    },
    highlights: [
      'Complesso della SS. Annunziata con Musei Civici e Domus Romana.',
      'Piazza Garibaldi, acquedotto medievale e Fontana del Vecchio.',
      'Corso Ovidio, Porta Napoli e Piazza XX Settembre con la statua di Ovidio.',
      "Museo dell'Arte Confettiera Pelino.",
      'Cattedrale di San Panfilo con cripta altomedievale.',
    ],
    practicalNote:
      "Sulmona è la fermata più flessibile del viaggio: resta nel centro storico se hai poco margine, mentre Badia Morronese ed Eremo di Sant'Onofrio hanno senso solo con molto anticipo o con un pernottamento in città.",
    howItWorks: [
      'Prima della corsa scegli un anello breve tra piazze e corso principale.',
      'Al rientro, soprattutto in inverno, privilegia musei, portici e locali del centro.',
      'Confetti e botteghe artigiane sono il souvenir più semplice da gestire senza allontanarti.',
    ],
    plans: [
      {
        id: 'sulmona-breve',
        label: 'Sosta breve',
        duration: '60-90 min',
        bestFor: 'Prima della partenza o rientro rapido',
        summary: 'Un percorso compatto tra i simboli della città, con una pausa dolce facile da incastrare.',
        logistics: 'Restando tra Piazza Garibaldi, Corso Ovidio e Annunziata mantieni tutto raggiungibile a piedi.',
        mealTip: 'Confetti artigianali, aperitivo leggero o gelato in centro sono le pause più facili da gestire.',
        activities: {
          spring: [
            'Piazza Garibaldi e acquedotto medievale del 1256, con passaggio alla Fontana del Vecchio.',
            "Passeggiata fino al Complesso dell'Annunziata e aperitivo all'aperto tra salumi e pecorino locale.",
          ],
          summer: [
            'Ingresso da Porta Napoli e camminata in ombra lungo Corso Ovidio.',
            'Sosta in Piazza XX Settembre davanti alla statua di Ovidio e gelato artigianale prima della ripartenza.',
          ],
          autumn: [
            "Visita al Museo dell'Arte Confettiera Pelino, cuore della memoria dolce della città.",
            'Passeggiata fino a Santa Maria della Tomba e acquisti di aglio rosso o prodotti tipici nelle botteghe.',
          ],
          winter: [
            "Annunziata, Musei Civici e Domus Romana sono il rifugio migliore nelle ore fredde.",
            'Portici di Corso Ovidio, vetrine illuminate e tappa rapida a San Panfilo chiudono bene il rientro.',
          ],
        },
      },
      {
        id: 'sulmona-comoda',
        label: 'Sosta comoda',
        duration: '2-3 ore',
        bestFor: 'Arrivo anticipato o rientro senza fretta',
        summary: 'Più tempo per unire visita culturale, passeggiata distesa e pausa seduta.',
        logistics: 'Puoi aggiungere un museo o una chiesa monumentale senza uscire dal perimetro del centro storico.',
        mealTip: 'Con più tempo funziona bene una trattoria del centro o una cena calda al rientro.',
        activities: {
          spring: [
            "Annunziata, acquedotto e centro storico con passo lento, lasciando spazio a foto e dettagli architettonici.",
            "Se sei in città da prima, Badia Morronese ed Eremo di Sant'Onofrio sono la deviazione culturale extra.",
          ],
          summer: [
            'Domus Romana e passeggiata serale lungo Corso Ovidio quando il sole cala.',
            "Sosta lunga tra piazze, botteghe e tavolini all'aperto nel cuore della città.",
          ],
          autumn: [
            'Pelino, Santa Maria della Tomba e shopping gastronomico tra botteghe artigiane.',
            "Confetti, Montepulciano d'Abruzzo e prodotti tipici raccontano bene la stagione.",
          ],
          winter: [
            "Cattedrale di San Panfilo, cripta altomedievale e musei dell'Annunziata.",
            "Cena in osteria con piatti caldi come chitarra al ragù d'agnello o zuppa di legumi.",
          ],
        },
      },
    ],
  },
  {
    id: 2,
    name: 'Campo di Giove',
    alt: '1.064m',
    type: 'Sosta',
    stopDuration: '90-120 min',
    timeHint: 'Il borgo è raccolto: una visita a piedi semplice e mirata basta per viverlo bene.',
    desc: 'Ai piedi della Majella, Campo di Giove unisce impianto medievale, rue in pietra e un ritmo da borgo di montagna ancora leggibile.',
    heroImage: '/photos/storia/campo-di-giove.webp',
    heroAlt: "Facciata della chiesa madre di Campo di Giove, tra pietra chiara e cielo di montagna.",
    schedule: {
      arrival: '10:15-10:30',
      departure: '12:00-12:15',
      duration: '1 h 30 - 2 h',
      note: 'Il tempo è limitato ma sufficiente per un anello nel centro storico, una visita culturale e una sosta gastronomica veloce.',
    },
    seasonContext: {
      spring: 'Il clima resta fresco e piacevole: è la stagione migliore per leggere dettagli architettonici e portali scolpiti.',
      summer: "L'altitudine mantiene l'aria leggera: le rue in ombra e i balconi fioriti sono il set naturale della visita.",
      autumn: 'Il borgo fortificato dialoga con il foliage della Majella e con sapori di stagione più decisi.',
      winter: 'Neve e pietra rendono Campo di Giove molto scenografico: conviene alternare una passeggiata breve a un interno caldo.',
    },
    highlights: [
      "Chiesa di Sant'Eustachio con coro ligneo e opere religiose.",
      'Rue e portali in pietra con mascheroni scolpiti.',
      'Casa Quaranta, tra le abitazioni più antiche del paese.',
      'Palazzo Nanni e memoria della transumanza.',
      'Piazza Duval e il perimetro del borgo fortificato.',
    ],
    practicalNote:
      'Campo di Giove si visita bene a piedi: il centro è raccolto e conviene non allungarsi troppo oltre il borgo se vuoi tenere margine per pranzo, acquisti o rientro al treno.',
    howItWorks: [
      'Dalla stazione punta subito al centro storico senza disperdere il tempo in deviazioni lunghe.',
      'Il percorso più equilibrato unisce chiesa madre, rue e piazza principale.',
      'Se prevedi una pausa pranzo, scegli qualcosa vicino al rientro o limita la sosta a un acquisto al forno o al caseificio.',
    ],
    plans: [
      {
        id: 'campo-breve',
        label: 'Sosta breve',
        duration: '60-75 min',
        bestFor: 'Prima esplorazione del borgo',
        summary: 'Un giro essenziale tra chiesa madre, vicoli storici e un assaggio del paese.',
        logistics: 'Il tragitto migliore resta compatto: chiesa, rue e piazza centrale senza strappi.',
        mealTip: 'Pane caldo, prodotti da forno e una bevanda in centro sono la scelta più agile.',
        activities: {
          spring: [
            "Visita alla Chiesa di Sant'Eustachio e primi vicoli del centro tra portali scolpiti e pietra chiara.",
            'Pausa veloce in forno per pane tipico e prodotti semplici del paese.',
          ],
          summer: [
            'Passeggiata tra le rue ombreggiate fino a Palazzo Nanni.',
            'Foto tra case in pietra, balconi fioriti e profilo netto della Majella.',
          ],
          autumn: [
            'Perimetro del borgo fortificato, dove le case sembrano ancora fungere da mura difensive.',
            'Piazza Duval per una pausa rapida con castagne o sapori stagionali.',
          ],
          winter: [
            "Chiesa di Sant'Eustachio e portali in pietra resi ancora più suggestivi dalla neve.",
            'Cioccolata calda o punch in un bar del centro prima del rientro.',
          ],
        },
      },
      {
        id: 'campo-lunga',
        label: 'Sosta lunga',
        duration: '90-120 min',
        bestFor: 'Visitare il borgo con una pausa gastronomica',
        summary: 'Un percorso più disteso che aggiunge luoghi identitari e qualche acquisto mirato.',
        logistics: 'Con due ore puoi inserire case storiche, piazza e una sosta in bottega senza correre.',
        mealTip: 'Caseificio, forno o un tavolo vicino al centro funzionano meglio di un pranzo dispersivo.',
        activities: {
          spring: [
            'Casa Quaranta, rue medievali e dettagli scolpiti sui portali antichi.',
            'Tappa al caseificio per pecorino locale e ricotta fresca.',
          ],
          summer: [
            'Salita verso la parte alta del borgo, dove si leggono i resti del castello medievale.',
            'Bottega di prodotti tipici o piccolo assaggio di genziana prima di sedersi a tavola.',
          ],
          autumn: [
            'Passeggiata completa nel borgo fortificato tra scorci in pietra e colori della montagna.',
            'Pranzo semplice della tradizione locale senza allontanarti dal centro.',
          ],
          winter: [
            'Giro nel centro innevato cercando i portali più belli e i passaggi più raccolti delle rue.',
            'Dolci abruzzesi e sosta al caldo prima di tornare al treno.',
          ],
        },
      },
    ],
  },
  {
    id: 3,
    name: 'Palena',
    alt: '1.258m',
    type: 'Punto panoramico',
    stopDuration: '40-90 min',
    timeHint: "La stazione non è in paese: la sosta cambia molto a seconda che ci sia o no la navetta.",
    desc: 'Nel Quarto Santa Chiara la ferrovia tocca uno dei suoi punti più scenografici: alta quota, silenzio e un borgo raggiungibile solo in alcuni itinerari.',
    heroImage: '/photos/storia/palena.webp',
    heroAlt: 'Paesaggio montano nei dintorni di Palena, ai margini della Majella.',
    schedule: {
      arrival: 'Variabile in base alla corsa storica',
      departure: 'Dopo la sosta panoramica o il trasferimento in navetta',
      duration: '40-60 min in stazione, fino a 90 min con borgo',
      note: 'La stazione è al Valico della Forchetta, circa 8-9 km sopra il centro abitato. In inverno la sosta resta di solito in quota.',
    },
    seasonContext: {
      spring: 'Quando la corsa prevede la navetta, è il momento migliore per unire natura, area faunistica ed eremi.',
      summer: "L'alta quota tiene la temperatura bassa e rende possibile una visita breve ma molto scenografica.",
      autumn: 'Il foliage del Quarto Santa Chiara è uno dei motivi più forti per scendere dal treno anche per poco.',
      winter: 'Palena in inverno è soprattutto una fermata fotografica: neve, vento e treno storico creano il momento più iconico del viaggio.',
    },
    highlights: [
      'Quarto Santa Chiara e valico della Forchetta.',
      'Possibile navetta per il borgo di Palena.',
      "Area Faunistica dell'Orso Bruno.",
      "Eremo Celestiniano della Madonna dell'Altare.",
      "Castello Ducale, Museo Geopaleontologico e Teatro Aventino.",
    ],
    practicalNote:
      "Qui la logistica conta più che altrove: se resti in stazione punta su panorama, foto e pausa breve; se c'è la navetta scegli in anticipo due tappe, perché il tempo reale nel borgo è inferiore al totale.",
    howItWorks: [
      'Verifica se la corsa prevede sola sosta panoramica o discesa in navetta.',
      'In inverno considera la fermata soprattutto come esperienza in alta quota vicino al treno.',
      'Se scendi in paese, concentrati su un solo asse di visita: area faunistica, eremo o castello con museo.',
    ],
    plans: [
      {
        id: 'palena-stazione',
        label: 'Sosta in stazione',
        duration: '40-60 min',
        bestFor: 'Panorama, fotografie e aria di alta quota',
        summary: 'La versione più essenziale ma anche più cinematografica di Palena, attorno alla stazione.',
        logistics: 'Restando nei dintorni della stazione sfrutti al massimo il tempo e non dipendi da trasferimenti.',
        mealTip: 'Quando presenti, i piccoli ristori temporanei con bevande calde e dolci sono la pausa più pratica.',
        activities: {
          spring: [
            'Belvedere sul Quarto Santa Chiara e primi segni del risveglio del Parco della Majella.',
            'Passeggiata breve nei dintorni della stazione con foto al treno storico nella conca montana.',
          ],
          summer: [
            'Sosta fresca tra prati alti, vento leggero e silenzio del valico.',
            'Sessione fotografica con il treno e il paesaggio aperto di una delle fermate più scenografiche.',
          ],
          autumn: [
            "Osservazione del foliage sull'altopiano, tra gialli, rossi e arancioni attorno alla stazione.",
            'Piccola pausa panoramica con prodotti locali se sono presenti i punti ristoro.',
          ],
          winter: [
            'Panorama innevato e scatti al treno nella neve, forse il momento più iconico di tutta la giornata.',
            'Tè caldo o vin brulé nei ristori temporanei, quando presenti.',
          ],
        },
      },
      {
        id: 'palena-borgo',
        label: 'Navetta per il borgo',
        duration: '60-90 min',
        bestFor: 'Una visita culturale compatta',
        summary: 'Quando il trasferimento è previsto, Palena aggiunge castello, museo e luoghi spirituali della Majella.',
        logistics: 'Concentrati su due tappe chiare: il borgo non consente dispersioni se vuoi rispettare i tempi del rientro.',
        mealTip: 'Meglio una pausa seduta breve o un acquisto locale facile da portare via.',
        activities: {
          spring: [
            "Area Faunistica dell'Orso Bruno, vicina al convento di Sant'Antonio.",
            "Escursione breve verso l'Eremo della Madonna dell'Altare, legato alla memoria di Pietro da Morrone.",
          ],
          summer: [
            "Castello Ducale e Museo Geopaleontologico dell'Alto Aventino, che racconta l'antica origine marina di queste montagne.",
            "Passeggiata nel centro storico fino al piccolo Teatro Aventino, raccolto e sorprendente.",
          ],
          autumn: [
            'Borgo di Palena tra scorci in pietra, miele di montagna, formaggi e dolci di mele locali.',
            'Fermata lenta tra paese e boschi della Majella, con il foliage che accompagna tutta la visita.',
          ],
          winter: [
            'Se la navetta è prevista anche con freddo intenso, limita la visita a un asse centrale del borgo.',
            'Pausa al caldo e ultimi scorci panoramici prima del rientro verso la stazione.',
          ],
        },
      },
    ],
  },
  {
    id: 4,
    name: 'Roccaraso',
    alt: '1.268m',
    type: 'Sosta',
    stopDuration: '2,5-3,5 ore',
    timeHint: "Qui c'è margine per pranzo e passeggiata: la fermata regge un ritmo più disteso.",
    desc: 'Ricostruita dopo la guerra e oggi elegante località montana, Roccaraso alterna memoria storica, shopping, pineta e turismo stagionale.',
    heroImage: '/photos/storia/roccaraso.webp',
    heroAlt: 'Veduta di Roccaraso tra il paese e i pendii montani circostanti.',
    schedule: {
      arrival: '11:30-12:00',
      departure: 'Primo pomeriggio, dopo 2,5-3,5 ore',
      duration: '2,5-3,5 ore',
      note: "Di solito c'è tempo sufficiente per pranzare con calma e fare una passeggiata completa tra centro, pratone o pineta.",
    },
    seasonContext: {
      spring: 'La fine della neve restituisce prati e sentieri facili: è il momento migliore per camminare senza fretta.',
      summer: "L'aria fresca rispetto alla pianura rende piacevoli pineta, centro e pranzo all'aperto.",
      autumn: 'Roccaraso cambia registro: sapori di bosco, luce limpida e memoria della ricostruzione emergono di più.',
      winter: 'Qui il viaggio incontra la località sciistica: neve, mercatini, dolci caldi e un centro molto più animato.',
    },
    highlights: [
      'Piazza Leone e centro ricostruito.',
      'Via Roma con negozi e botteghe di montagna.',
      "Pratone e Piazza Prato per una pausa all'aperto.",
      'Pineta Ombrellone e Parco Avventura.',
      'Eremo di San Michele e memoria della Seconda Guerra Mondiale.',
    ],
    practicalNote:
      'Roccaraso permette di allargare il raggio più delle altre fermate: puoi pranzare con calma e poi scegliere se restare tra centro e shopping o spostarti verso pratone e pineta, senza forzare una camminata lunga.',
    howItWorks: [
      'Considera il pranzo come parte della visita, non come interruzione.',
      'Il centro è lineare: Via Roma, piazza, chiesa e monumenti si leggono bene in sequenza.',
      'Se scegli pineta o eremo, tieni un ritorno semplice e non sommare troppi spostamenti.',
    ],
    plans: [
      {
        id: 'roccaraso-breve',
        label: 'Sosta breve',
        duration: '60-90 min',
        bestFor: 'Centro, dolci e atmosfera montana',
        summary: 'Un percorso essenziale per cogliere il carattere elegante e stagionale della località.',
        logistics: 'Concentrati su centro e piazze, lasciando sentieri e pineta a una sosta più lunga.',
        mealTip: 'Dolce artigianale, bevanda calda o pranzo veloce vicino al centro evitano perdite di tempo.',
        activities: {
          spring: [
            'Pausa al Pratone e passeggiata lungo Via Roma tra negozi, verde e aria nitida di montagna.',
            "Breve salita panoramica verso l'Eremo di San Michele, se vuoi inserire un affaccio sulla valle.",
          ],
          summer: [
            'Passeggiata in centro e relax veloce nella Pineta Ombrellone al riparo dal sole.',
            'Tagliere o pranzo leggero prima di rientrare in stazione.',
          ],
          autumn: [
            'Via Roma fino a Santa Maria Assunta, con luce limpida e temperature più fresche.',
            'Sosta gastronomica tra porcini, tartufo e prodotti del sottobosco.',
          ],
          winter: [
            'Piazza Leone tra decorazioni, neve e atmosfera sciistica.',
            'Pasticceria o bar del centro per dolci artigianali e bevande calde come il bombardino.',
          ],
        },
      },
      {
        id: 'roccaraso-lunga',
        label: 'Sosta lunga',
        duration: '2-3 ore',
        bestFor: 'Pranzo con calma e camminata completa',
        summary: 'La fermata che permette meglio di combinare cucina di montagna, verde e memoria del territorio.',
        logistics: 'Dopo pranzo scegli un solo asse esteso: centro con memoria storica oppure pineta con attività outdoor.',
        mealTip: 'Con 2-3 ore ha senso sedersi in un ristorante e poi chiudere con una passeggiata lenta.',
        activities: {
          spring: [
            'Camminata ampia tra Pratone, centro e negozi di montagna.',
            "Sentiero semplice verso l'Eremo di San Michele, con vista aperta sulla valle.",
          ],
          summer: [
            'Pineta Ombrellone con eventuale tappa al Parco Avventura.',
            'Pranzo con cucina abruzzese e giro rilassato nel paese ricostruito.',
          ],
          autumn: [
            'Passeggiata completa tra centro, chiesa e monumenti che ricordano la Seconda Guerra Mondiale.',
            'Pranzo con sapori di bosco, funghi porcini o tartufo.',
          ],
          winter: [
            'Palaghiaccio G. Bolino oppure centro innevato tra negozi e luminarie.',
            'Pranzo al caldo tra cioccolata, dolci di montagna e cucina sostanziosa.',
          ],
        },
      },
    ],
  },
  {
    id: 5,
    name: 'Castel di Sangro',
    alt: '793m',
    type: 'Capolinea',
    stopDuration: '3-4 ore',
    timeHint: 'Una delle soste più comode: puoi pranzare senza fretta e aggiungere una vera visita culturale.',
    desc: "L'antica Aufidena unisce fiume, musei, palazzi storici e quartieri alti: è la fermata che regge meglio un itinerario completo.",
    heroImage: '/photos/storia/castel-di-sangro.webp',
    heroAlt: 'Veduta di Castel di Sangro con il tessuto urbano che segue la valle del Sangro.',
    schedule: {
      arrival: '12:30-13:00',
      departure: '16:30-17:00',
      duration: '3-4 ore',
      note: 'La sosta è abbastanza lunga da permettere pranzo, centro storico e almeno una visita museale o panoramica.',
    },
    seasonContext: {
      spring: 'Le giornate più lunghe rendono naturale un percorso tra fiume, convento e quartiere alto della Civita.',
      summer: 'Nelle ore centrali conviene alternare chiostri, musei e vicoli ombreggiati come Terravecchia.',
      autumn: 'Il Sangro, i ponti e i colori del foliage danno un tono più lento e fotografico alla visita.',
      winter: 'Pranzo caldo, pinacoteca e piazza storica sono la combinazione migliore quando la temperatura si abbassa.',
    },
    highlights: [
      'Piazza Plebiscito e fontana monumentale.',
      'Palazzo De Petra con Pinacoteca Teofilo Patini.',
      'Convento della Maddalena e Museo della Pesca a Mosca.',
      'Museo Civico Aufidenate con reperti sanniti e romani.',
      'Civita, Terravecchia e Basilica di Santa Maria Assunta.',
    ],
    practicalNote:
      'Castel di Sangro consente davvero di combinare pranzo e cultura: scegli prima se vuoi privilegiare il fiume e il complesso della Maddalena oppure i quartieri alti, così eviti di frammentare troppo il pomeriggio.',
    howItWorks: [
      'Usa il pranzo come pausa centrale e costruisci il percorso intorno a un solo polo culturale principale.',
      'La ciclopedonale del Sangro e il convento funzionano bene insieme; Civita, basilica e Terravecchia fanno un secondo asse coerente.',
      'Prima del rientro resta nel centro per acquisti facili come miele, formaggi o specialità al tartufo.',
    ],
    plans: [
      {
        id: 'castel-breve',
        label: 'Sosta breve',
        duration: '60-90 min',
        bestFor: 'Centro storico e una visita mirata',
        summary: 'Un itinerario compatto che tiene insieme piazza, palazzo storico e una camminata breve.',
        logistics: 'Scegli un solo polo: piazza e palazzo oppure fiume e convento, senza tentare tutto.',
        mealTip: 'Trattoria del centro o pausa veloce in piazza sono le opzioni più efficienti.',
        activities: {
          spring: [
            'Passeggiata lungo il fiume Sangro o sulla ciclopedonale vicina al centro.',
            'Salita verso la Civita per un primo affaccio panoramico sulla valle.',
          ],
          summer: [
            'Convento della Maddalena, più fresco e ombreggiato nelle ore centrali.',
            'Giro rapido a Terravecchia tra archi in pietra e vicoli stretti.',
          ],
          autumn: [
            'Centro storico tra Palazzo De Petra, Palazzo Balzano e scorci sul borgo antico.',
            'Acquisti di miele, formaggi stagionati o specialità al tartufo prima della ripartenza.',
          ],
          winter: [
            'Piazza Plebiscito e pranzo caldo nel cuore della città.',
            'Palazzo De Petra con una visita rapida alla Pinacoteca Teofilo Patini.',
          ],
        },
      },
      {
        id: 'castel-lunga',
        label: 'Sosta lunga',
        duration: '3-4 ore',
        bestFor: 'Pranzo senza fretta e percorso completo',
        summary: 'Il capolinea ideale per unire musei, quartieri storici, fiume e cucina del territorio.',
        logistics: 'Con più tempo puoi visitare un museo e chiudere il percorso con Civita o ciclopedonale.',
        mealTip: 'Qui vale la pena sedersi davvero: i tempi permettono un pranzo completo prima del rientro.',
        activities: {
          spring: [
            'Convento della Maddalena con Museo Internazionale della Pesca a Mosca.',
            'Passeggiata lunga tra ciclopedonale del Sangro, Civita e Basilica di Santa Maria Assunta.',
          ],
          summer: [
            'Complesso della Maddalena con doppia visita a Museo Civico Aufidenate e museo della pesca.',
            'Terravecchia e basilica per chiudere con un panorama ampio sulla valle.',
          ],
          autumn: [
            'Museo Civico Aufidenate e camminata lungo il Sangro tra ponti, acqua e foliage.',
            'Pranzo tranquillo e ultimi acquisti di prodotti di montagna nel centro.',
          ],
          winter: [
            'Pranzo completo della tradizione e visita culturale tra palazzo storico e pinacoteca.',
            'Passeggiata finale in piazza tra luci, fontana e atmosfera di capolinea.',
          ],
        },
      },
    ],
  },
];
