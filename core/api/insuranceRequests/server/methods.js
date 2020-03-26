import {
  insuranceRequestInsert,
  insuranceRequestRemove,
  insuranceRequestUpdate,
  insuranceRequestSetAdminNote,
  insuranceRequestRemoveAdminNote,
  insuranceRequestSetAssignees,
  insuranceRequestUpdateStatus,
  insuranceRequestInsertBorrower,
  insuranceRequestLinkBorrower,
  insuranceRequestLinkLoan,
  insuranceRequestLinkNewLoan,
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

insuranceRequestSetAdminNote.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  InsuranceRequestService.setAdminNote({ ...params, userId });
});

insuranceRequestRemoveAdminNote.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  return InsuranceRequestService.removeAdminNote(params);
});

insuranceRequestSetAssignees.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  return InsuranceRequestService.setAssignees(params);
});

insuranceRequestUpdateStatus.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  return InsuranceRequestService.setStatus(params);
});

insuranceRequestInsertBorrower.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  return InsuranceRequestService.addBorrower(params);
});

insuranceRequestLinkBorrower.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  return InsuranceRequestService.linkBorrower(params);
});

insuranceRequestLinkLoan.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  return InsuranceRequestService.linkLoan(params);
});

insuranceRequestLinkNewLoan.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  return InsuranceRequestService.linkNewLoan(params);
});
