import { EMAIL_IDS } from '../../email/emailConstants';
import { sendEmailToAddress } from '../../email/server/methods';
import { calculatorLoan } from '../../fragments';
import { Method } from '../../methods/methods';
import SecurityService from '../../security';
import Security from '../../security/Security';
import UserService from '../../users/server/UserService';
import { INSURANCE_POTENTIAL, LOAN_STATUS, STEPS } from '../loanConstants';
import {
  addClosingChecklists,
  addNewMaxStructure,
  addNewStructure,
  adminLoanInsert,
  anonymousLoanInsert,
  assignLoanToUser,
  duplicateStructure,
  loanDelete,
  loanGetReusableProperties,
  loanInsertBorrowers,
  loanLinkBorrower,
  loanLinkPromotion,
  loanLinkProperty,
  loanRemoveAdminNote,
  loanSetAdminNote,
  loanSetAssignees,
  loanSetCreatedAtActivityDescription,
  loanSetDisbursementDate,
  loanSetStatus,
  loanShareSolvency,
  loanUnlinkPromotion,
  loanUpdate,
  loanUpdatePromotionInvitedBy,
  notifyInsuranceTeamForPotential,
  popLoanValue,
  pushLoanValue,
  removeStructure,
  reuseProperty,
  selectStructure,
  sendLoanChecklist,
  sendNegativeFeedbackToLenders,
  setLoanStep,
  setMaxPropertyValueOrBorrowRatio,
  switchBorrower,
  updateInsurancePotential,
  updateStructure,
  upsertUserProperty,
  userLoanInsert,
} from '../methodDefinitions';
import LoanService from './LoanService';

loanUpdate.setHandler(({ userId }, { loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId, userId);
  return LoanService.update({ loanId, object });
});

loanDelete.setHandler((context, { loanId }) => {
  SecurityService.loans.isAllowedToDelete(loanId);
  return LoanService.remove({ loanId });
});

pushLoanValue.setHandler(({ userId }, { loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId, userId);
  return LoanService.pushValue({ loanId, object });
});

popLoanValue.setHandler(({ userId }, { loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId, userId);
  return LoanService.popValue({ loanId, object });
});

export const adminLoanInsertHandler = (
  { userId: adminUserId },
  { userId, loan },
) => {
  SecurityService.checkUserIsAdmin(adminUserId);
  const loanId = LoanService.fullLoanInsert({ userId, loan });

  if (!userId) {
    // Make sure new, loose, loans are assigned to the one creating them
    // so we don't have unassigned loans in the DB
    LoanService.setAssignees({
      loanId,
      assignees: [{ _id: adminUserId, isMain: true, percent: 100 }],
    });
  }

  return { loanId, userId };
};
adminLoanInsert.setHandler(adminLoanInsertHandler);

userLoanInsert.setHandler(
  ({ userId }, { test, proPropertyId, purchaseType }) => {
    SecurityService.checkLoggedIn();

    if (proPropertyId) {
      return LoanService.insertPropertyLoan({
        userId,
        propertyIds: [proPropertyId],
        loan: { displayWelcomeScreen: false },
      });
    }

    return LoanService.fullLoanInsert({
      userId,
      loan: {
        displayWelcomeScreen: false,
        status: test ? LOAN_STATUS.TEST : LOAN_STATUS.LEAD,
        purchaseType,
      },
    });
  },
);
userLoanInsert.setRateLimit({ limit: 1, timeRange: 30000 }); // Once every 30sec

export const addStructureHandler = ({ userId }, { loanId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId, userId);
  return LoanService.addNewStructure({ loanId });
};
addNewStructure.setHandler(addStructureHandler);

export const removeStructureHandler = ({ userId }, { loanId, structureId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId, userId);
  return LoanService.removeStructure({ loanId, structureId });
};
removeStructure.setHandler(removeStructureHandler);

export const updateStructureHandler = (
  { userId },
  { loanId, structureId, structure },
) => {
  SecurityService.loans.isAllowedToUpdate(loanId, userId);
  return LoanService.updateStructure({ loanId, structureId, structure });
};
updateStructure.setHandler(updateStructureHandler);

export const selectStructureHandler = ({ userId }, { loanId, structureId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId, userId);
  return LoanService.selectStructure({ loanId, structureId });
};
selectStructure.setHandler(selectStructureHandler);

export const duplicateStructureHandler = (
  { userId },
  { loanId, structureId },
) => {
  SecurityService.loans.isAllowedToUpdate(loanId, userId);
  return LoanService.duplicateStructure({ loanId, structureId });
};
duplicateStructure.setHandler(duplicateStructureHandler);

assignLoanToUser.setHandler(({ userId }, params) => {
  const { anonymous } = LoanService.get(params.loanId, { anonymous: 1 });

  if (anonymous) {
    SecurityService.loans.checkAnonymousLoan(params.loanId);
  } else {
    SecurityService.checkUserIsAdmin(userId);
  }

  LoanService.assignLoanToUser(params);
});

switchBorrower.setHandler(({ userId }, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId, userId);
  return LoanService.switchBorrower(params);
});

loanUpdatePromotionInvitedBy.setHandler(({ userId }, params) => {
  Security.checkUserIsAdmin(userId);
  LoanService.updatePromotionInvitedBy(params);
});

reuseProperty.setHandler((context, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId, context.userId);
  LoanService.reuseProperty(params);
});

setMaxPropertyValueOrBorrowRatio.setHandler(({ userId }, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId, userId);
  return LoanService.setMaxPropertyValueOrBorrowRatio(params);
});
setMaxPropertyValueOrBorrowRatio.setRateLimit({ limit: 2, timeRange: 30000 }); // Twice every 30sec

addNewMaxStructure.setHandler(({ userId }, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId, userId);
  return LoanService.addNewMaxStructure(params);
});
addNewMaxStructure.setRateLimit({ limit: 2, timeRange: 30000 }); // Twice every 30sec

setLoanStep.setHandler(({ userId }, params) => {
  const userAllowedSteps = [STEPS.SOLVENCY, STEPS.REQUEST];

  if (userAllowedSteps.includes(params.nextStep)) {
    SecurityService.loans.isAllowedToUpdate(params.loanId, userId);
  } else {
    Security.checkUserIsAdmin(userId);
  }

  return LoanService.setStep(params);
});

loanShareSolvency.setHandler(({ userId }, params) => {
  const { loanId, shareSolvency } = params;
  SecurityService.loans.isAllowedToUpdate(loanId, userId);
  return LoanService.update({
    loanId: params.loanId,
    object: { shareSolvency },
  });
});

anonymousLoanInsert.setHandler((context, params) => {
  const { proPropertyId, existingAnonymousLoanId } = params;
  if (proPropertyId) {
    SecurityService.properties.isAllowedToAddAnonymousLoan({
      propertyId: proPropertyId,
    });
  }

  if (existingAnonymousLoanId) {
    // If an anonymous loan exists on the client, don't add another one
    // If a new property is requested on it, add it to the existing loan
    if (proPropertyId) {
      const existingLoan = LoanService.get(existingAnonymousLoanId, {
        propertyIds: 1,
        promotionLinks: 1,
      });

      if (
        existingLoan?.propertyIds &&
        !existingLoan.propertyIds.includes(proPropertyId)
      ) {
        // TODO: Quentin, track this
        LoanService.addPropertyToLoan({
          loanId: existingAnonymousLoanId,
          propertyId: proPropertyId,
        });
      }
    }

    return existingAnonymousLoanId;
  }

  return LoanService.insertAnonymousLoan(params);
});
anonymousLoanInsert.setRateLimit({ limit: 1, timeRange: 30000 }); // Once every 30sec

loanInsertBorrowers.setHandler(({ userId }, params) => {
  const { loanId } = params;
  SecurityService.loans.isAllowedToUpdate(loanId, userId);
  LoanService.insertBorrowers(params);
});
loanInsertBorrowers.setRateLimit({ limit: 2, timeRange: 10000 }); // Twice every 10sec

loanLinkPromotion.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.linkPromotion(params);
});

loanUnlinkPromotion.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.unlinkPromotion(params);
});

loanSetCreatedAtActivityDescription.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.setCreatedAtActivityDescription(params);
});

loanSetStatus.setHandler((context, params) => {
  try {
    SecurityService.checkIsInternalCall(context);
  } catch (error) {
    SecurityService.checkUserIsAdmin(context.userId);
  }
  return LoanService.setStatus(params);
});

sendLoanChecklist.setHandler(
  ({ userId }, { loanId, address, emailParams, basicDocumentsOnly }) => {
    SecurityService.checkUserIsAdmin(userId);
    const {
      email: assigneeAddress,
      name: assigneeName,
    } = UserService.get(userId, { email: 1, name: 1 });
    const loan = LoanService.get(loanId, calculatorLoan());
    return sendEmailToAddress.serverRun({
      address,
      emailId: EMAIL_IDS.LOAN_CHECKLIST,
      params: {
        ...emailParams,
        loan,
        assigneeAddress,
        assigneeName,
        basicDocumentsOnly,
      },
    });
  },
);

loanSetAdminNote.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.setAdminNote({ ...params, userId });
});

loanRemoveAdminNote.setHandler(({ userId }, { loanId, ...params }) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.removeAdminNote({ docId: loanId, ...params });
});

loanSetDisbursementDate.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.setDisbursementDate(params);
});

export const generateDisbursedSoonLoansTasks = new Method({
  name: 'generateDisbursedSoonLoansTasks',
  params: {},
});

generateDisbursedSoonLoansTasks.setHandler(context => {
  SecurityService.checkIsInternalCall(context);
  return LoanService.getDisbursedSoonLoans();
});

loanSetAssignees.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.setAssignees(params);
});

loanLinkBorrower.setHandler(({ userId }, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId, userId);
  return LoanService.linkBorrower(params);
});

loanGetReusableProperties.setHandler(({ userId }, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId, userId);
  return LoanService.getReusableProperties(params);
});

loanLinkProperty.setHandler(({ userId }, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId, userId);
  return LoanService.linkProperty(params);
});

addClosingChecklists.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.addClosingChecklists(params);
});

notifyInsuranceTeamForPotential.setHandler(({ userId }, { loanId }) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.updateInsurancePotential({
    loanId,
    insurancePotential: INSURANCE_POTENTIAL.NOTIFIED,
  });
});

updateInsurancePotential.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.updateInsurancePotential(params);
});

upsertUserProperty.setHandler(({ userId }, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId, userId);
  return LoanService.upsertUserProperty(params);
});

sendNegativeFeedbackToLenders.setHandler((context, params) => {
  const { userId } = context;
  Security.checkUserIsAdmin(userId);
  return LoanService.sendNegativeFeedbackToLenders(params);
});
