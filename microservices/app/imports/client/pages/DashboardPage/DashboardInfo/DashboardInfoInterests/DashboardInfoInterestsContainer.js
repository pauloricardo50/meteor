import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { currentInterestRates } from 'core/api/interestRates/queries';
import { loanOffers } from 'core/api/offers/queries';

export default compose(
  withSmartQuery({
    query: loanOffers,
    params: ({ loan: { _id: loanId } }) => ({ loanId }),
    queryOptions: { reactive: false },
    smallLoader: true,
    dataName: 'offers',
  }),
  withSmartQuery({
    query: currentInterestRates,
    queryOptions: { reactive: false },
    smallLoader: true,
    dataName: 'generalInterestRates',
  }),
);
