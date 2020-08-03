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
  sendNegativeFeedbackToAllLenders,
  setLoanStep,
  setMaxPropertyValueOrBorrowRatio,
  switchBorrower,
  updateInsurancePotential,
  updateStructure,
  userLoanInsert,
} from '../methodDefinitions';
import LoanService from './LoanService';

loanUpdate.setHandler((context, { loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.update({ loanId, object });
});

loanDelete.setHandler((context, { loanId }) => {
  SecurityService.loans.isAllowedToDelete(loanId);
  return LoanService.remove({ loanId });
});

pushLoanValue.setHandler((context, { loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.pushValue({ loanId, object });
});

popLoanValue.setHandler((context, { loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
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

  return loanId;
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
  const { anonymous } = LoanService.get(params.loanId, { anonymous: 1 });

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

sendNegativeFeedbackToAllLenders.setHandler((context, params) => {
  const { userId } = context;
  Security.checkUserIsAdmin(userId);
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

setMaxPropertyValueOrBorrowRatio.setHandler((context, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId);
  return LoanService.setMaxPropertyValueOrBorrowRatio(params);
});
setMaxPropertyValueOrBorrowRatio.setRateLimit({ limit: 2, timeRange: 30000 }); // Twice every 30sec

addNewMaxStructure.setHandler((context, params) => {
  SecurityService.loans.isAllowedToUpdate(params.loanId);
  return LoanService.addNewMaxStructure(params);
});
addNewMaxStructure.setRateLimit({ limit: 2, timeRange: 30000 }); // Twice every 30sec

setLoanStep.setHandler((context, params) => {
  const userAllowedSteps = [STEPS.SOLVENCY, STEPS.REQUEST];

  if (userAllowedSteps.includes(params.nextStep)) {
    SecurityService.loans.isAllowedToUpdate(params.loanId);
  } else {
    Security.checkUserIsAdmin(context.userId);
  }

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
      });

      if (
        existingLoan &&
        existingLoan.propertyIds &&
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

  const loanId = LoanService.insertAnonymousLoan(params);

  return loanId;
});
anonymousLoanInsert.setRateLimit({ limit: 1, timeRange: 30000 }); // Once every 30sec

loanInsertBorrowers.setHandler((context, params) => {
  const { loanId } = params;
  SecurityService.loans.isAllowedToUpdate(loanId);
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
  SecurityService.checkCurrentUserIsAdmin(userId);
  return LoanService.updateInsurancePotential(params);
});
