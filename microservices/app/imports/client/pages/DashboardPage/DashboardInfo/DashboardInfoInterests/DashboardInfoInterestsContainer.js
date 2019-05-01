import { compose } from 'recompose';
import { withSmartQuery } from 'core/api';
import loanOffers from 'core/api/offers/queries/loanOffers';
import currentInterestRates from 'core/api/interestRates/queries/currentInterestRates';

export default compose(
  withSmartQuery({
    query: loanOffers,
    params: ({ loan: { _id: loanId } }) => ({ loanId }),
    queryOptions: { reactive: false },
    dataName: 'offers',
  }),
  withSmartQuery({
    query: currentInterestRates,
    dataName: 'generalInterestRates',
    smallLoader: true,
  }),
);
