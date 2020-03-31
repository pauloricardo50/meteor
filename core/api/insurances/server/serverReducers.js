import Insurances from '..';
import InsuranceService from './InsuranceService';

Insurances.addReducers({
  estimatedRevenue: {
    body: { _id: 1 },
    reduce: ({ _id: insuranceId }) =>
      InsuranceService.getEstimatedRevenue({ insuranceId }),
  },
});
