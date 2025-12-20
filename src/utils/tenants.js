const languages = [
  { id: 1, label: '🇪🇸 Español' },
  { id: 2, label: '🇬🇧 Inglés' },
  { id: 3, label: '🇫🇷 Francés' },
  { id: 4, label: '🇵🇹 Portugués' },
  { id: 5, label: '🇮🇹 Italiano' },
  { id: 6, label: '🇩🇪 Alemán' },
  { id: 7, label: '🇵🇹 Portugal-Madeira' },
];

const stores = [
  { id: 1, name: '🇪🇸 España' },
  { id: 2, name: '🇬🇧 Inglaterra' },
  { id: 3, name: '🇫🇷 Francia' },
  { id: 4, name: '🇵🇹 Portugal' },
  { id: 5, name: '🇮🇹 Italia' },
  { id: 6, name: '🇵🇹 Madeira' },
  { id: 7, name: '🇩🇪 Alemania' },
];

const languageToStoreMap = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
};

/**
 * Combina la lista de lenguajes con las tiendas usando el mapa de relaciones.
 * @param {Array} languages - Lista de objetos de lenguaje.
 * @param {Array} stores - Lista de objetos de tienda.
 * @param {Object} mapping - Objeto LanguageID -> StoreID.
 * @returns {Array} La lista consolidada de tenants.
 */
function getTenants(languages, stores, mapping) {
  const storesMap = stores.reduce((acc, store) => {
    acc[store.id] = store.name;
    return acc;
  }, {});

  const tenants = languages.map((language) => {
    const storeId = mapping[language.id];
    const storeName = storesMap[storeId] || null;

    return {
      id: language.id,
      label: language.label,
      store: storeName,
    };
  });

  return tenants;
}

export const tenants = getTenants(languages, stores, languageToStoreMap);
