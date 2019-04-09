import { withProps } from 'recompose';

import {
  columnOptions,
  formatInterestRates,
  getInterestRatesFromOffers,
} from './dashboardInfoInterestsHelpers';

export default withProps(({ loan: { enableOffers }, offers, generalInterestRates }) => {
  const interestRates = enableOffers
    ? getInterestRatesFromOffers(offers)
    : generalInterestRates.rates;

  return {
    columnOptions,
    rows: formatInterestRates(interestRates),
    date: enableOffers ? null : generalInterestRates.date,
  };
});
