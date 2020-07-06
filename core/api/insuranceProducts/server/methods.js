import Security from '../../security/Security';
import {
  insuranceProductInsert,
  insuranceProductRemove,
  insuranceProductUpdate,
} from '../methodDefinitions';
import InsuranceProductService from './InsuranceProductService';

insuranceProductInsert.setHandler((context, { insuranceProduct }) => {
  Security.checkUserIsAdmin(context.userId);
  return InsuranceProductService.insert(insuranceProduct);
});

insuranceProductRemove.setHandler((context, { insuranceProductId }) => {
  // This is dangerous because it can break a lot of insuranceRequests
  // We should only remove products if they aren't linked anywhere
  Security.checkUserIsDev(context.userId);
  return InsuranceProductService.remove(insuranceProductId);
});

insuranceProductUpdate.setHandler((context, { insuranceProductId, object }) => {
  Security.checkUserIsAdmin(context.userId);
  return InsuranceProductService._update({ id: insuranceProductId, object });
});
