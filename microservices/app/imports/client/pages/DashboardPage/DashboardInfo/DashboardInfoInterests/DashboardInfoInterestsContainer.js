import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { currentInterestRates } from 'core/api/interestRates/queries';
import { loanOffers } from 'core/api/offers/queries';

export default compose(
  withSmartQuery({
    query: loanOffers,
    params: ({ loan: { _id: loanId } }) => ({
      loanId,
      $body: {
        interestLibor: 1,
        interest1: 1,
        interest2: 1,
        interest5: 1,
        interest10: 1,
        interest15: 1,
        interest20: 1,
        interest25: 1,
      },
    }),
    deps: ({ loan: { _id: loanId } }) => [loanId],
    smallLoader: true,
    dataName: 'offers',
  }),
  withSmartQuery({
    query: currentInterestRates,
    smallLoader: true,
    dataName: 'generalInterestRates',
  }),
);
