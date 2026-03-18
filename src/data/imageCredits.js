const PROJECT_ARCHIVE_PATHS = [
  '/photos/storia/sulmona-panorama-urbano.jpg',
  '/photos/storia/sulmona-confetti.jpg',
  '/photos/storia/sulmona-madonna-che-scappa.jpg',
  '/photos/storia/sulmona-acquedotto-arcate.jpg',
  '/photos/storia/sulmona-piazza-garibaldi.jpg',
  '/photos/storia/sulmona-ovidio-centro.jpg',
  '/photos/storia/campo-di-giove-panorama.jpg',
  '/photos/storia/campo-di-giove-chiesa.jpg',
  '/photos/storia/campo-di-giove-borgo.jpg',
  '/photos/storia/campo-di-giove-panorama-autunno.jpg',
  '/photos/storia/campo-di-giove-scale.jpg',
  '/photos/storia/campo-di-giove-meridiana.jpg',
  '/photos/storia/palena-panorama.jpg',
  '/photos/storia/palena-chiesa-di-san-falco.jpg',
  '/photos/storia/palena-fontana.jpg',
  '/photos/storia/palena-panorama-invernale.jpg',
  '/photos/storia/palena-scorcio-porta.jpg',
  '/photos/storia/palena-torrente.jpg',
  '/photos/storia/roccaraso-inverno.jpg',
  '/photos/storia/roccaraso-borgo-viadotto.jpg',
  '/photos/storia/roccaraso-centro.jpg',
  '/photos/storia/roccaraso-neve-boschi.jpg',
  '/photos/storia/roccaraso-chiesa.jpg',
  '/photos/storia/roccaraso-pista.jpg',
  '/photos/storia/castel-di-sangro-panorama.jpg',
  '/photos/storia/castel-di-sangro-santa-maria-assunta.jpg',
  '/photos/storia/castel-di-sangro-piazza.jpg',
  '/photos/storia/castel-di-sangro-valle.jpg',
  '/photos/storia/castel-di-sangro-belvedere.jpg',
  '/photos/storia/castel-di-sangro-notte.jpg',
  '/photos/storia/isernia-panorama.jpg',
  '/photos/storia/isernia-centro-storico.jpg',
  '/photos/storia/isernia-piazza-celestino-v.jpg',
  '/photos/storia/isernia-vicolo-torre.jpg',
  '/photos/storia/isernia-vicolo-campanile.jpg',
  '/photos/storia/isernia-sanfelice.jpg',
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
  '/photos/fermate/sulmona-fermata.jpg': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione_di_Sulmona_2011_by-RaBoe_11.jpg',
  },
  '/photos/fermate/campo-di-giove.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione_Campo_di_Giove.jpg',
  },
  '/photos/fermate/campo-di-giove.jpg': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione_Campo_di_Giove.jpg',
  },
  '/photos/fermate/castel-di-sangro.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione-castel-di-sangro.jpg',
  },
  '/photos/fermate/castel-di-sangro.jpg': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione-castel-di-sangro.jpg',
  },
  '/photos/fermate/palena.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione_Palena.jpg',
  },
  '/photos/fermate/palena.jpg': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Stazione_Palena.jpg',
  },
  '/photos/fermate/roccaraso.webp': {
    label: 'Wikimedia Commons',
    url: 'https://commons.wikimedia.org/wiki/File:Roccaraso_-_stazione_ferroviaria.jpg',
  },
  '/photos/fermate/roccaraso.jpg': {
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
  '/photos/journey/1888-inizio-costruzione.jpg': {
    label: 'Rivisondoli Antiqua',
    url: 'http://www.rivisondoliantiqua.it/gli%20altipiani%20nella%20storia/muscolino%20%20capolavoro.htm',
  },
  '/photos/journey/1897-inaugurazione.jpg': {
    label: 'Ferrovia dei Parchi',
    url: 'https://ferroviadeiparchi.it/2021/05/03/dalle-origini-ad-oggi/',
  },
  '/photos/journey/anni-40-guerra.jpg': {
    label: 'Ferrovia dei Parchi',
    url: 'https://ferroviadeiparchi.it/2021/05/03/dalle-origini-ad-oggi/',
  },
  '/photos/journey/anni-60-80-declino.jpg': {
    label: 'CESMOT',
    url: 'https://www.cesmot.it/2011/03/31/la-ferrovia-sulmona-carpinone/',
  },
  '/photos/journey/2014-rinascita-turistica.jpg': {
    label: 'FamilyGo',
    url: 'https://www.familygo.eu/vacanze-con-bambini/viaggi/abruzzo/ferrovia-dei-parchi-treno-storico-transiberiana-ditalia/',
  },
  '/photos/journey/2011-sospensione.jpg': {
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
