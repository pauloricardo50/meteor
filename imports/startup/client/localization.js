import { addLocaleData } from 'react-intl';
import { T9n } from 'meteor/softwarerero:accounts-t9n';

// Import used languages from the package here
import fr from 'react-intl/locale-data/fr';
// import en from 'react-intl/locale-data/en';
// import es from 'react-intl/locale-data/es';

export const getUserLocale = () => {
  return 'fr';
};

export const getTranslations = () => ({});

export const getFormats = () => {
  return {
    number: {
      money: {
        style: 'currency',
        currency: 'CHF ',
      },
    },
  };
};

export const localizationStartup = () => {
  // Add locales used in app here
  addLocaleData([...fr]);
  T9n.setLanguage(getUserLocale());
};
