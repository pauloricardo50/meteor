import { compose, createContainer, withSmartQuery } from 'core/api';
import offersQuery from 'core/api/offers/queries/offers';
import generalInterestRates from 'core/components/InterestRatesTable/interestRates';

import {
  columnOptions,
  rows,
  getBestRatesInAllOffers,
  getInterestRatesFromOffers,
} from './loanInterestsTableHelpers';

export const LoanInterestsTableContainer = compose(
  withSmartQuery({
    query: ({ loanId }) => offersQuery.clone({ loanId }),
    queryOptions: { reactive: true },
    dataName: 'offers',
  }),
  createContainer(({ hasAuctionEnded, offers }) => ({
    columnOptions,
    rows: hasAuctionEnded
      ? rows({ interestRates: getBestRatesInAllOffers({ offers }) })
      : rows({ interestRates: generalInterestRates }),
  })),
);

export default LoanInterestsTableContainer;
