import Security from '../../security/Security';
import {
  insuranceInsert,
  insuranceModify,
  insuranceRemoveAdminNote,
  insuranceSetAdminNote,
} from '../methodDefinitions';
import InsuranceService from './InsuranceService';

insuranceInsert.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  return InsuranceService.insert(params);
});

insuranceModify.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  return InsuranceService.update(params);
});

insuranceSetAdminNote.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  InsuranceService.setAdminNote({ ...params, userId });
});

insuranceRemoveAdminNote.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  return InsuranceService.removeAdminNote(params);
});
