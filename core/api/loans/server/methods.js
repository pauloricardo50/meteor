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
  adminLoanInsert,
  addNewStructure,
  removeStructure,
  updateStructure,
  selectStructure,
  duplicateStructure,
  assignLoanToUser,
  switchBorrower,
  sendNegativeFeedbackToAllLenders,
  loanUpdatePromotionInvitedBy,
  reuseProperty,
  setMaxPropertyValueWithoutBorrowRatio,
  addNewMaxStructure,
  setLoanStep,
  loanShareSolvency,
  anonymousLoanInsert,
  userLoanInsert,
} from '../methodDefinitions';
import LoanService from './LoanService';
import Security from '../../security/Security';
import { STEPS } from '../loanConstants';

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

export const adminLoanInsertHandler = ({ userId: adminUserId }, { userId }) => {
  SecurityService.checkUserIsAdmin(adminUserId);
  return LoanService.fullLoanInsert({ userId });
};
adminLoanInsert.setHandler(adminLoanInsertHandler);

userLoanInsert.setHandler(({ userId }) => {
  SecurityService.checkLoggedIn();
  return LoanService.fullLoanInsert({ userId });
});

export const addStructureHandler = (context, { loanId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.addNewStructure({ loanId });
};
addNewStructure.setHandler(addStructureHandler);

export const removeStructureHandler = (context, { loanId, structureId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.removeStructure({ loanId, structureId });
};
removeStructure.setHandler(removeStructureHandler);

export const updateStructureHandler = (
  context,
  { loanId, structureId, structure },
) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.updateStructure({ loanId, structureId, structure });
};
updateStructure.setHandler(updateStructureHandler);

export const selectStructureHandler = (context, { loanId, structureId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.selectStructure({ loanId, structureId });
};
selectStructure.setHandler(selectStructureHandler);

export const duplicateStructureHandler = (context, { loanId, structureId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.duplicateStructure({ loanId, structureId });
};
duplicateStructure.setHandler(duplicateStructureHandler);

assignLoanToUser.setHandler(({ userId }, params) => {
  const { anonymous } = LoanService.fetchOne({
    $filters: { _id: params.loanId },
    anonymous: 1,
  });

  if (anonymous) {
    SecurityService.loans.checkAnonymousLoan(params.loanId);
  } else {
    SecurityService.checkUserIsAdmin(userId);
  }

  LoanService.assignLoanToUser(params);
});

switchBorrower.setHandler((context, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId);
  return LoanService.switchBorrower(params);
});

sendNegativeFeedbackToAllLenders.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  context.unblock();
  return LoanService.sendNegativeFeedbackToAllLenders(params);
});

loanUpdatePromotionInvitedBy.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  LoanService.updatePromotionInvitedBy(params);
});

reuseProperty.setHandler((context, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId);
  LoanService.reuseProperty(params);
});

setMaxPropertyValueWithoutBorrowRatio.setHandler((context, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId);
  return LoanService.setMaxPropertyValueWithoutBorrowRatio(params);
});

addNewMaxStructure.setHandler((context, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId);
  return LoanService.addNewMaxStructure(params);
});

setLoanStep.setHandler((context, params) => {
  const userAllowedSteps = [STEPS.SOLVENCY, STEPS.REQUEST];

  if (userAllowedSteps.includes(params.nextStep)) {
    SecurityService.loans.isAllowedToUpdate(params.loanId);
  } else {
    Security.checkUserIsAdmin(context.userId);
  }

  context.unblock();
  return LoanService.setStep(params);
});

loanShareSolvency.setHandler((context, params) => {
  const { loanId, shareSolvency } = params;
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.update({
    loanId: params.loanId,
    object: { shareSolvency },
  });
});

anonymousLoanInsert.setHandler((context, params) => {
  if (params.proPropertyId) {
    SecurityService.properties.isAllowedToAddAnonymousLoan({
      propertyId: params.proPropertyId,
    });
  }

  return LoanService.insertAnonymousLoan(params);
});
