import SecurityService from '../../security';
import { checkInsertUserId } from '../../helpers/server/methodServerHelpers';
import {
  loanInsert,
  loanUpdate,
  loanDelete,
  requestLoanVerification,
  confirmClosing,
  pushLoanValue,
  popLoanValue,
  disableUserForms,
  enableUserForms,
  adminLoanInsert,
  addNewStructure,
  removeStructure,
  updateStructure,
  selectStructure,
  duplicateStructure,
  assignLoanToUser,
  switchBorrower,
} from '../methodDefinitions';
import LoanService from './LoanService';

loanInsert.setHandler((context, { loan, userId }) => {
  userId = checkInsertUserId(userId);
  return LoanService.insert({ loan, userId });
});

loanUpdate.setHandler((context, { loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.update({ loanId, object });
});

loanDelete.setHandler((context, { loanId }) => {
  SecurityService.loans.isAllowedToDelete(loanId);
  return LoanService.remove({ loanId });
});

requestLoanVerification.setHandler((context, { loanId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.askVerification({ loanId });
});

confirmClosing.setHandler((context, { loanId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LoanService.confirmClosing({ loanId, object });
});

pushLoanValue.setHandler((context, { loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.pushValue({ loanId, object });
});

popLoanValue.setHandler((context, { loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.popValue({ loanId, object });
});

export const disableUserFormsHandler = ({ userId }, { loanId }) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.disableUserForms({ loanId });
};
disableUserForms.setHandler(disableUserFormsHandler);

export const enableUserFormsHandler = ({ userId }, { loanId }) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.enableUserForms({ loanId });
};
enableUserForms.setHandler(enableUserFormsHandler);

export const adminLoanInsertHandler = ({ userId: adminUserId }, { userId }) => {
  SecurityService.checkUserIsAdmin(adminUserId);
  return LoanService.adminLoanInsert({ userId });
};
adminLoanInsert.setHandler(adminLoanInsertHandler);

export const addStructureHandler = ({ userId }, { loanId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.addNewStructure({ loanId });
};
addNewStructure.setHandler(addStructureHandler);

export const removeStructureHandler = ({ userId }, { loanId, structureId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.removeStructure({ loanId, structureId });
};
removeStructure.setHandler(removeStructureHandler);

export const updateStructureHandler = (
  { userId },
  { loanId, structureId, structure },
) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.updateStructure({ loanId, structureId, structure });
};
updateStructure.setHandler(updateStructureHandler);

export const selectStructureHandler = ({ userId }, { loanId, structureId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.selectStructure({ loanId, structureId });
};
selectStructure.setHandler(selectStructureHandler);

export const duplicateStructureHandler = (
  { userId },
  { loanId, structureId },
) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.duplicateStructure({ loanId, structureId });
};
duplicateStructure.setHandler(duplicateStructureHandler);

assignLoanToUser.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  LoanService.assignLoanToUser(params);
});

switchBorrower.setHandler(({ userId }, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId);
  return LoanService.switchBorrower(params);
});
