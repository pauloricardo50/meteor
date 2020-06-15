import { COMMISSION_RATES_TYPE } from '../../commissionRates/commissionRateConstants';
import CommissionRateService from '../../commissionRates/server/CommissionRateService';
import InsuranceService from '../../insurances/server/InsuranceService';
import RevenueService from '../../revenues/server/RevenueService';
import { getCurrentRate } from '../helpers';
import Organisations from '..';

Organisations.addReducers({
  generatedRevenues: {
    body: { _id: 1 },
    reduce: ({ _id: organisationId }) =>
      RevenueService.getGeneratedRevenues({ organisationId }),
  },
  generatedProductions: {
    body: { _id: 1 },
    reduce: ({ _id: organisationId }) =>
      InsuranceService.getGeneratedProductions({ organisationId }),
  },
  commissionRate: {
    body: { name: 1 },
    reduce: ({ _id: organisationId, name }) => {
      let generatedRevenues = 0;
      const { rates = [] } =
        CommissionRateService.get(
          {
            'organisationLink._id': organisationId,
            type: COMMISSION_RATES_TYPE.COMMISSIONS,
          },
          { rates: 1 },
        ) || {};
      if (rates.length > 1) {
        generatedRevenues = RevenueService.getGeneratedRevenues({
          organisationId,
        });
      }

      return getCurrentRate(rates, generatedRevenues, name);
    },
  },
  productionRate: {
    body: { name: 1 },
    reduce: ({ _id: organisationId, name }) => {
      let generatedProductions = 0;
      const { rates = [] } =
        CommissionRateService.get(
          {
            'organisationLink._id': organisationId,
            type: COMMISSION_RATES_TYPE.PRODUCTIONS,
          },
          { rates: 1 },
        ) || {};
      if (rates.length > 1) {
        generatedProductions = InsuranceService.getGeneratedProductions({
          organisationId,
        });
      }

      return getCurrentRate(rates, generatedProductions, name);
    },
  },
});
