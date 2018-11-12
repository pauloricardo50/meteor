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
    params: ({ loan: { _id: loanId } }) => ({ loanId }),
    dataName: 'offers',
  }),
  withProps(({ loan: { enableOffers }, offers }) => ({
    columnOptions,
    rows: enableOffers
      ? rows({ interestRates: getInterestRatesFromOffers(offers) })
      : rows({ interestRates: generalInterestRates }),
  })),
);

export default DashboardInfoInterestsTableContainer;
