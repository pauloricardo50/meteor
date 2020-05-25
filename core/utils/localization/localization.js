// This file is shared between client and server to allow server-side tests to have access to it

import moment from 'moment';

import intl from '../intl';
import { setupMoment } from './localizationHelpers';
import translateSimpleSchema from './simpleSchemaLocalization';

export const localizationStartup = ({
  setupAccounts = true,
  setupCountries = true,
  messages,
} = {}) => {
  setupMoment();
  moment.locale('fr');

  translateSimpleSchema();

  const oldFormatMessage = intl.formatMessage;

  intl.formatMessage = (...args) => {
    const [firstArg, ...rest] = args;

    return oldFormatMessage({ ...firstArg, messages }, ...rest);
  };

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

  // Do this for browsers that don't have language things
  // https://formatjs.io/docs/react-intl/upgrade-guide-3x#migrate-to-using-native-intl-apis
  if (!Intl.PluralRules) {
    require('@formatjs/intl-pluralrules/polyfill');
    require('@formatjs/intl-pluralrules/dist/locale-data/fr'); // Add locale data for de
  }
  if (!Intl.RelativeTimeFormat) {
    require('@formatjs/intl-relativetimeformat/polyfill');
    require('@formatjs/intl-relativetimeformat/dist/locale-data/fr'); // Add locale data for de
  }
};
