import {
  insuranceRequestInsert,
  insuranceRequestRemove,
  insuranceRequestUpdate,
} from '../methodDefinitions';
import InsuranceRequestService from './InsuranceRequestService';
import Security from '../../security/Security';

insuranceRequestInsert.setHandler((context, params) => {
  Security.checkCurrentUserIsAdmin();
  return InsuranceRequestService.insert(params);
});

insuranceRequestRemove.setHandler((context, { insuranceRequestId }) => {
  Security.checkCurrentUserIsAdmin();
  return InsuranceRequestService.remove(insuranceRequestId);
});

insuranceRequestUpdate.setHandler((context, { insuranceRequestId, object }) => {
  Security.checkCurrentUserIsAdmin();
  return InsuranceRequestService._update({ id: insuranceRequestId, object });
});
