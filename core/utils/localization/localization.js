// This file is shared between client and server to allow server-side tests to have access to it

import moment from 'moment';
import { addLocaleData } from 'react-intl';
import fr from 'react-intl/locale-data/fr';

import Intl from '../intl';
import { setupMoment } from './localizationHelpers';
import translateSimpleSchema from './simpleSchemaLocalization';

export const localizationStartup = ({
  setupAccounts = true,
  messages,
  setupCountries = true,
} = {}) => {
  // Add locales used in app here
  Intl.init(messages);
  addLocaleData(fr);

  setupMoment();
  moment.locale('fr');

  translateSimpleSchema();

  if (setupAccounts) {
    const { T9n } = require('meteor-accounts-t9n');
    const { fr: accountsFr } = require('meteor-accounts-t9n/build/fr');
    T9n.map('fr', accountsFr);
    T9n.map('fr', {
      error: {
        accounts: {
          'Account Deactivated': 'Compte désactivé',
        },
      },
    });
    T9n.setLanguage('fr');
  }

  if (setupCountries) {
    const countries = require('i18n-iso-countries');
    countries.registerLocale(require('i18n-iso-countries/langs/fr.json'));
  }
};
