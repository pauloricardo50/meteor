import { withProps, compose } from 'recompose';
import { withSmartQuery } from 'core/api';
import offersQuery from 'core/api/offers/queries/offers';
import currentInterestRates from 'core/api/interestRates/queries/currentInterestRates';

import {
  columnOptions,
  rows,
  getInterestRatesFromOffers,
} from './dashboardInfoInterestsHelpers';

export const DashboardInfoInterestsTableContainer = compose(
  withSmartQuery({
    query: offersQuery,
    params: ({ loan: { _id: loanId } }) => ({ loanId }),
    dataName: 'offers',
  }),
  withSmartQuery({
    query: currentInterestRates,
    queryOptions: { reactive: true },
    dataName: 'generalInterestRates',
    smallLoader: true,
  }),
  withProps(({ loan: { enableOffers }, offers, generalInterestRates }) => ({
    columnOptions,
    rows: enableOffers
      ? rows({ interestRates: getInterestRatesFromOffers(offers) })
      : rows({ interestRates: generalInterestRates.rates }),
    date: generalInterestRates.date,
  })),
);

export default DashboardInfoInterestsTableContainer;
