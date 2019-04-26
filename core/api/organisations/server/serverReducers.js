import Organisations from '..';
import RevenueService from '../../revenues/server/RevenueService';
import { getCurrentRate } from '../helpers';

Organisations.addReducers({
  generatedRevenues: {
    body: { _id: 1 },
    reduce: ({ _id: organisationId }) =>
      RevenueService.getGeneratedRevenues({ organisationId }),
  },
  commissionRate: {
    body: { commissionRates: 1 },
    reduce: ({ commissionRates = [], _id: organisationId }) => {
      let generatedRevenues = 0;
      if (commissionRates.length > 1) {
        generatedRevenues = RevenueService.getGeneratedRevenues({
          organisationId,
        });
      }

      return getCurrentRate(commissionRates, generatedRevenues);
    },
  },
});
