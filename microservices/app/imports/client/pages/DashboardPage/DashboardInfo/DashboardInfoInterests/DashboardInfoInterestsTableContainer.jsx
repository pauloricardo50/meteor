import { withProps, compose } from 'recompose';
import { withSmartQuery } from 'core/api';
import offersQuery from 'core/api/offers/queries/offers';
import generalInterestRates from 'core/components/InterestRatesTable/interestRates';

import {
  columnOptions,
  rows,
  getInterestRatesFromOffers,
} from './dashboardInfoInterestsHelpers';

export const DashboardInfoInterestsTableContainer = compose(
  withSmartQuery({
    query: offersQuery,
    params: ({ loanId }) => ({ loanId }),
    // queryOptions: { reactive: true }, // FIXME: Crashes E2E tests
    dataName: 'offers',
  }),
  withProps(({ offers }) => ({
    columnOptions,
    rows:
      offers && offers.length > 0
        ? rows({ interestRates: getInterestRatesFromOffers(offers) })
        : rows({ interestRates: generalInterestRates }),
  })),
);

export default DashboardInfoInterestsTableContainer;
