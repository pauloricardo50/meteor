import { COMMISSION_RATES_TYPE } from 'core/api/commissionRates/commissionRateConstants';
import Organisations from '..';
import RevenueService from '../../revenues/server/RevenueService';
import { getCurrentRate } from '../helpers';
import CommissionRateService from '../../commissionRates/server/CommissionRateService';

Organisations.addReducers({
  generatedRevenues: {
    body: { _id: 1 },
    reduce: ({ _id: organisationId }) =>
      RevenueService.getGeneratedRevenues({ organisationId }),
  },
  commissionRate: {
    body: { name: 1 },
    reduce: ({ _id: organisationId, name }) => {
      let generatedRevenues = 0;
      const { rates: commissionRates = [] } =
        CommissionRateService.get(
          {
            'organisationLink._id': organisationId,
            type: COMMISSION_RATES_TYPE.COMMISSIONS,
          },
          { rates: 1 },
        ) || {};
      if (commissionRates.length > 1) {
        generatedRevenues = RevenueService.getGeneratedRevenues({
          organisationId,
        });
      }

      return getCurrentRate(commissionRates, generatedRevenues, name);
    },
  },
});
