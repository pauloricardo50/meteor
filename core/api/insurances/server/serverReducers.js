import Insurances from '..';
import InsuranceService from './InsuranceService';

Insurances.addReducers({
  duration: {
    body: { _id: 1 },
    reduce: ({ _id: insuranceId }) =>
      InsuranceService.getInsuranceDuration({ insuranceId }),
  },
  estimatedRevenue: {
    body: { _id: 1 },
    reduce: ({ _id: insuranceId }) =>
      InsuranceService.getEstimatedRevenue({ insuranceId }),
  },
});
