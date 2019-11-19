// This file is shared between client and server to allow server-side tests to have access to it

import { addLocaleData } from 'react-intl';
import moment from 'moment';
import fr from 'react-intl/locale-data/fr';
import translateSimpleSchema from './simpleSchemaLocalization';
import Intl from '../intl';

export const getUserLocale = () => 'fr-CH';

export const getFormats = () => ({
  number: {
    money: {
      style: 'currency',
      currency: 'CHF',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    },
    moneyWithoutCurrency: {
      style: 'decimal',
      useGrouping: true,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    },
    percentage: {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    percentageRounded: {
      style: 'percent',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    },
  },
});

const setupMoment = () => {
  moment.locale('fr', {
    months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split(
      '_',
    ),
    monthsShort: 'Janv._Févr._Mars_Avr._Mai_Juin_Juil._Août_Sept._Oct._Nov._Déc.'.split(
      '_',
    ),
    monthsParseExact: true,
    weekdays: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
    weekdaysShort: 'Dim._Lun._Mar._Mer._Jeu._Ven._Sam.'.split('_'),
    weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
    weekdaysParseExact: true,
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'DD/MM/YYYY',
      LL: 'D MMMM YYYY',
      LLL: 'D MMMM YYYY HH:mm',
      LLLL: 'dddd D MMMM YYYY HH:mm',
    },
    calendar: {
      sameDay: '[Aujourd’hui à] LT',
      nextDay: '[Demain à] LT',
      nextWeek: 'dddd [à] LT',
      lastDay: '[Hier à] LT',
      lastWeek: 'dddd [dernier à] LT',
      sameElse: 'L',
    },
    relativeTime: {
      future: 'dans %s',
      past: 'il y a %s',
      s: 'qq secs',
      m: '1m',
      mm: '%dm',
      h: '1h',
      hh: '%dh',
      d: '1j',
      dd: '%dj',
      M: '1 mois',
      MM: '%d mois',
      y: '1 an',
      yy: '%d ans',
    },
    dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
    ordinal(number) {
      return number + (number === 1 ? 'er' : 'e');
    },
    meridiemParse: /PD|MD/,
    isPM(input) {
      return input.charAt(0) === 'M';
    },
    // In case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example).
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
    // },
    meridiem(hours, minutes, isLower) {
      return hours < 12 ? 'PD' : 'MD';
    },
    week: {
      dow: 1, // Monday is the first day of the week.
      doy: 4, // The week that contains Jan 4th is the first week of the year.
    },
  });
};

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
