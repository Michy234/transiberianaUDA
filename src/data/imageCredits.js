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
