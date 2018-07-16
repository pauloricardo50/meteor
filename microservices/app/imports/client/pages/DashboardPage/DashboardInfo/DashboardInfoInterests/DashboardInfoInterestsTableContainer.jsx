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
    query: ({ loanId }) => offersQuery.clone({ loanId }),
    queryOptions: { reactive: true },
    dataName: 'offers',
  }),
  withProps(({ auctionHasEnded, offers }) => ({
    columnOptions,
    rows:
      auctionHasEnded && offers && offers.length > 0
        ? rows({ interestRates: getInterestRatesFromOffers(offers) })
        : rows({ interestRates: generalInterestRates }),
  })),
);

export default DashboardInfoInterestsTableContainer;
