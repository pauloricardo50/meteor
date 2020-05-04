import InsuranceService from './InsuranceService';
import Insurances from '..';

Insurances.addReducers({
  estimatedRevenue: {
    body: { _id: 1 },
    reduce: ({ _id: insuranceId }) =>
      InsuranceService.getEstimatedRevenue({ insuranceId }),
  },
});
