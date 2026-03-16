const WIKIMEDIA_COMMONS = {
  '/photos/fermate/sulmona-fermata.webp': {
    label: 'Facebook',
    url: 'https://www.facebook.com/photo.php?fbid=3305097212891376&set=a.487027536765685&id=100063753275407',
  },
  '/photos/fermate/sulmona-fermata.jpg': {
    label: 'Facebook',
    url: 'https://www.facebook.com/photo.php?fbid=3305097212891376&set=a.487027536765685&id=100063753275407',
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
