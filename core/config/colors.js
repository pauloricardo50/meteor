import { INTEREST_RATES } from 'core/api/interestRates/interestRatesConstants';

const colors = {
  primary: '#005bea',
  primaryArray: [0, 91, 234],
  secondary: '#00c6ff',
  tertiary: '#001a8f',
  success: '#21d3b5',
  warning: '#F3AF50',
  error: '#e01076',
  mix: '#95299D', // Mix between error and primary
  borderGrey: '#DEE2E6',
  charts: ['#2C82BE', '#76DDFB', '#DBECF8', '#53A8E2', '#6AC6FF', '#005bea'],
  iconColor: '#444',
  iconHoverColor: '#888',
  body: '#666',
  title: '#444',
  mui: {
    background: '#fff',
    contrastText: '#fff',
    darkPrimary: '#0048bb', // Darken 20%
    darkSuccess: '#1aa890', // Darken 20%
    darkError: '#b30c5e', // Darken 20%
  },
  interestRates: {
    [INTEREST_RATES.LIBOR]: '#0047AC',
    [INTEREST_RATES.YEARS_1]: '#2C82BE',
    [INTEREST_RATES.YEARS_2]: '#A8B9C5',
    [INTEREST_RATES.YEARS_5]: '#43AAC8',
    [INTEREST_RATES.YEARS_10]: '#005bea',
    [INTEREST_RATES.YEARS_15]: '#2075AF',
    [INTEREST_RATES.YEARS_20]: '#3793CC',
    [INTEREST_RATES.YEARS_25]: '#53A8E2',
    irs10y: '#0048bb',
  },
};

export default colors;
