import {
  insuranceProductInsert,
  insuranceProductRemove,
  insuranceProductUpdate,
} from '../methodDefinitions';
import InsuranceProductService from './InsuranceProductService';
import Security from '../../security/Security';

insuranceProductInsert.setHandler((context, { insuranceProduct }) => {
  Security.checkCurrentUserIsAdmin();
  return InsuranceProductService.insert(insuranceProduct);
});

insuranceProductRemove.setHandler((context, { insuranceProductId }) => {
  Security.checkCurrentUserIsAdmin();
  return InsuranceProductService.remove(insuranceProductId);
});

insuranceProductUpdate.setHandler((context, { insuranceProductId, object }) => {
  Security.checkCurrentUserIsAdmin();
  return InsuranceProductService._update({ id: insuranceProductId, object });
});
