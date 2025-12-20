export const getLangFlag = (lang) => {
  switch (lang) {
    case 'en':
      return '🇺🇸';
    case 'es':
      return '🇪🇸';
    case 'fr':
      return '🇫🇷';
    case 'de':
      return '🇩🇪';
    case 'it':
      return '🇮🇹';
    case 'ja':
      return '🇯🇵';
    case 'ko':
      return '🇰🇷';
    case 'pt':
      return '🇵🇹';
    case 'mad':
      return '🇵🇹';
    case 'ru':
      return '🇷🇺';
    case 'zh':
      return '🇨🇳';
    default:
      return '🏳️';
  }
};

export const getLangTitle = (lang) => {
  switch (lang) {
    case 'en':
      return 'Inglés';
    case 'es':
      return 'Español';
    case 'fr':
      return 'Francés';
    case 'de':
      return 'Alemán';
    case 'it':
      return 'Italiano';
    case 'ja':
      return 'Japonés';
    case 'ko':
      return 'Coreano';
    case 'pt':
      return 'Portugués';
    case 'mad':
      return 'Madeira-PT';
    case 'ru':
      return 'Ruso';
    case 'zh':
      return 'Chino';
    default:
      return 'Desconocido';
  }
};
