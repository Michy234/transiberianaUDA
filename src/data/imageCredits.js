const PROJECT_ARCHIVE_PATHS = [
  '/photos/storia/sulmona-panorama-urbano.webp',
  '/photos/storia/sulmona-confetti.webp',
  '/photos/storia/sulmona-madonna-che-scappa.webp',
  '/photos/storia/sulmona-acquedotto-arcate.webp',
  '/photos/storia/sulmona-piazza-garibaldi.webp',
  '/photos/storia/sulmona-ovidio-centro.webp',
  '/photos/storia/campo-di-giove-panorama.webp',
  '/photos/storia/campo-di-giove-chiesa.webp',
  '/photos/storia/campo-di-giove-borgo.webp',
  '/photos/storia/campo-di-giove-panorama-autunno.webp',
  '/photos/storia/campo-di-giove-scale.webp',
  '/photos/storia/campo-di-giove-meridiana.webp',
  '/photos/storia/palena-panorama.webp',
  '/photos/storia/palena-chiesa-di-san-falco.webp',
  '/photos/storia/palena-fontana.webp',
  '/photos/storia/palena-panorama-invernale.webp',
  '/photos/storia/palena-scorcio-porta.webp',
  '/photos/storia/palena-torrente.webp',
  '/photos/storia/roccaraso-inverno.webp',
  '/photos/storia/roccaraso-borgo-viadotto.webp',
  '/photos/storia/roccaraso-centro.webp',
  '/photos/storia/roccaraso-neve-boschi.webp',
  '/photos/storia/roccaraso-chiesa.webp',
  '/photos/storia/roccaraso-pista.webp',
  '/photos/storia/castel-di-sangro-panorama.webp',
  '/photos/storia/castel-di-sangro-santa-maria-assunta.webp',
  '/photos/storia/castel-di-sangro-piazza.webp',
  '/photos/storia/castel-di-sangro-valle.webp',
  '/photos/storia/castel-di-sangro-belvedere.webp',
  '/photos/storia/castel-di-sangro-notte.webp',
  '/photos/storia/isernia-panorama.webp',
  '/photos/storia/isernia-centro-storico.webp',
  '/photos/storia/isernia-piazza-celestino-v.webp',
  '/photos/storia/isernia-vicolo-torre.webp',
  '/photos/storia/isernia-vicolo-campanile.webp',
  '/photos/storia/isernia-sanfelice.webp',
];

const PROJECT_ARCHIVE = Object.fromEntries(
  PROJECT_ARCHIVE_PATHS.map((path) => [
    path,
    {
      label: 'Archivio fotografico fornito dal progetto',
    },
  ]),
);

const WIKIMEDIA_COMMONS = {
  '/photos/fermate/sulmona-fermata.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione_di_Sulmona_2011_by-RaBoe_11.jpg',
  },
  '/photos/fermate/sulmona-fermata.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione_di_Sulmona_2011_by-RaBoe_11.jpg',
  },
  '/photos/fermate/campo-di-giove.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione_Campo_di_Giove.jpg',
  },
  '/photos/fermate/campo-di-giove.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione_Campo_di_Giove.jpg',
  },
  '/photos/fermate/castel-di-sangro.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione-castel-di-sangro.jpg',
  },
  '/photos/fermate/castel-di-sangro.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione-castel-di-sangro.jpg',
  },
  '/photos/fermate/palena.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione_Palena.jpg',
  },
  '/photos/fermate/palena.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione_Palena.jpg',
  },
  '/photos/fermate/roccaraso.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Roccaraso_-_stazione_ferroviaria.jpg',
  },
  '/photos/fermate/roccaraso.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Roccaraso_-_stazione_ferroviaria.jpg',
  },
  '/photos/storia/transiberiana.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:La_Transiberiana_d%27Italia.jpg',
  },
  '/photos/storia/sulmona.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Panorama_di_Sulmona.jpg',
  },
  '/photos/storia/campo-di-giove.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Campo_di_Giove_-_Esterno_della_chiesa_madre_di_Sant%27Eustachio.JPG',
  },
  '/photos/storia/palena.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Monte_Porrara,_Palena.JPG',
  },
  '/photos/storia/roccaraso.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Roccaraso.jpg',
  },
  '/photos/storia/castel-di-sangro.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Castel_di_Sangro01.jpg',
  },
  '/photos/journey/1888-inizio-costruzione.webp': {
    label: 'Rivisondoli Antiqua',
    url: 'http://www.rivisondoliantiqua.it/gli%20altipiani%20nella%20storia/muscolino%20%20capolavoro.htm',
  },
  '/photos/journey/1897-inaugurazione.webp': {
    label: 'Ferrovia dei Parchi',
    url: 'https://ferroviadeiparchi.it/2021/05/03/dalle-origini-ad-oggi/',
  },
  '/photos/journey/anni-40-guerra.webp': {
    label: 'Ferrovia dei Parchi',
    url: 'https://ferroviadeiparchi.it/2021/05/03/dalle-origini-ad-oggi/',
  },
  '/photos/journey/anni-60-80-declino.webp': {
    label: 'CESMOT',
    url: 'https://www.cesmot.it/2011/03/31/la-ferrovia-sulmona-carpinone/',
  },
  '/photos/journey/2014-rinascita-turistica.webp': {
    label: 'FamilyGo',
    url: 'https://www.familygo.eu/vacanze-con-bambini/viaggi/abruzzo/ferrovia-dei-parchi-treno-storico-transiberiana-ditalia/',
  },
  '/photos/journey/2011-sospensione.webp': {
    label: 'Toni Pulsani (2018)',
  },
  ...PROJECT_ARCHIVE,
};

function getUnsplashCredit(src) {
  const match = src.match(/images\.unsplash\.com\/photo-([^?]+)/);
  if (!match) return null;
  const id = match[1];
  return {
    label: 'Unsplash',
    url: `https://unsplash.com/photos/${id}`,
  };
}

export function getImageCredit(src) {
  if (!src || typeof src !== 'string') return null;
  const clean = src.split('?')[0];
  const unsplash = getUnsplashCredit(clean);
  if (unsplash) return unsplash;
  return WIKIMEDIA_COMMONS[clean] || null;
}
