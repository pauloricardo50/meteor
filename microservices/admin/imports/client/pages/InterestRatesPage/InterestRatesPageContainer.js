// This is necessary for the global query to work
// https://github.com/cult-of-coders/grapher/issues/432
import 'core/api/irs10y/irs10y';

import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { INTEREST_RATES_COLLECTION } from 'core/api/interestRates/interestRatesConstants';
import { currentInterestRates } from 'core/api/interestRates/queries';
import { IRS10Y_COLLECTION } from 'core/api/irs10y/irs10yConstants';

export default compose(
  withSmartQuery({
    query: INTEREST_RATES_COLLECTION,
    params: {
      $options: { sort: { date: -1 } },
      createdAt: 1,
      updatedAt: 1,
      date: 1,
      interestLibor: 1,
      interest1: 1,
      interest2: 1,
      interest5: 1,
      interest10: 1,
      interest15: 1,
      interest20: 1,
      interest25: 1,
    },
    dataName: 'interestRates',
    smallLoader: true,
  }),
  withSmartQuery({
    query: IRS10Y_COLLECTION,
    params: {
      $options: { sort: { date: -1 } },
      date: 1,
      rate: 1,
    },
    dataName: 'irs10y',
    smallLoader: true,
  }),
  withSmartQuery({
    query: currentInterestRates,
    dataName: 'currentInterestRates',
    smallLoader: true,
  }),
);
