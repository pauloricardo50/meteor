import SecurityService from '../../security';
import LoanService from '../LoanService';
import {
  loanInsert,
  loanUpdate,
  loanDelete,
  incrementLoanStep,
  requestLoanVerification,
  startAuction,
  endAuction,
  cancelAuction,
  confirmClosing,
  loanChangeAdminNote,
  pushLoanValue,
  popLoanValue,
  disableUserForms,
  enableUserForms,
  adminLoanInsert,
  addStructure,
  removeStructure,
  updateStructure,
  selectStructure,
  duplicateStructure,
} from '../methodDefinitions';
import { checkInsertUserId } from '../../helpers/server/methodServerHelpers';

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

incrementLoanStep.setHandler((context, { loanId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.incrementStep({ loanId });
});

requestLoanVerification.setHandler((context, { loanId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.askVerification({ loanId });
});

startAuction.setHandler((context, { loanId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.startAuction({ loanId });
});

endAuction.setHandler((context, { loanId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LoanService.startAuction({ loanId });
});

cancelAuction.setHandler((context, { loanId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LoanService.startAuction({ loanId });
});

confirmClosing.setHandler((context, { loanId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LoanService.confirmClosing({ loanId, object });
});

loanChangeAdminNote.setHandler((context, { loanId, adminNote }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LoanService.update({ loanId, object: { adminNote } });
});

pushLoanValue.setHandler((context, { loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.pushValue(object);
});

popLoanValue.setHandler((context, { loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.pushValue(object);
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
  return LoanService.addStructure({ loanId });
};
addStructure.setHandler(addStructureHandler);

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
