import { withProps, compose } from 'recompose';
import { withSmartQuery } from 'core/api';
import offersQuery from 'core/api/offers/queries/offers';
import generalInterestRates from 'core/components/InterestRatesTable/interestRates';

import {
  columnOptions,
  rows,
  getInterestRatesFromOffers,
} from './loanInterestsTableHelpers';

export const LoanInterestsTableContainer = compose(
  withSmartQuery({
    query: ({ loanId }) => offersQuery.clone({ loanId }),
    queryOptions: { reactive: true },
    dataName: 'offers',
  }),
  withProps(({ hasAuctionEnded, offers }) => ({
    columnOptions,
    rows: hasAuctionEnded
      ? rows({ interestRates: getInterestRatesFromOffers({ offers }) })
      : rows({ interestRates: generalInterestRates }),
  })),
);

export default LoanInterestsTableContainer;
