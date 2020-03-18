import {
  insuranceInsert,
  insuranceModify,
  insuranceSetAdminNote,
  insuranceRemoveAdminNote,
} from '../methodDefinitions';
import Security from '../../security/Security';
import InsuranceService from './InsuranceService';

insuranceInsert.setHandler((context, params) => {
  Security.checkCurrentUserIsAdmin();
  return InsuranceService.insert(params);
});

insuranceModify.setHandler((context, params) => {
  Security.checkCurrentUserIsAdmin();
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
