import api_key from './api_key';

const key = api_key;

export default {
  host: 'https://uat.logismata.ch',
  authUrl(testKey) {
    return `${this.host}/puma/authentication/${testKey || key}/createToken`;
  },
  calcUrl() {
    return `${this.host}/puma/calculator/onlinetax/calculate`;
  },
  calcUrl2: () => 'https://hookb.in/vLNmVA3y',
};

export const logismataValues = {
  civilStatus: {
    default: 2,
    2: 'single',
    3: 'concubinage',
    4: 'married',
    7: 'registered partnership',
  },
  confession: {
    default: 'other',
    1: 'reformed',
    2: 'roman catholic',
    3: 'christian catholic',
    4: 'undenominational',
    5: 'other',
  },
  incomeBase: {
    default: 1,
    1: 'gross income',
    2: 'taxable income',
  },
  sex: {
    default: 1,
    1: 'male',
    2: 'female',
  },
  country: {
    default: 0,
    0: 'all',
    756: 'CH',
    438: 'LI',
  },
  language: {
    default: 0,
    0: 'all',
    1: 'german',
    2: 'french',
    3: 'italien',
  },
  mortgageType: {
    default: 2,
    1: 'Variable Rate',
    2: 'Fixed Rate',
    3: 'Libor',
  },
  savingType: {
    default: 1,
    1: 'Saving 3a',
    2: 'Saving 3b/Assets',
  },
  existingOrNew: {
    default: 1,
    0: 'existing',
    1: 'new',
  },
};
