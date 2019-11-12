import { Meteor } from 'meteor/meteor';

import { EMAIL_IDS } from '../../email/emailConstants';
import { sendEmailToAddress } from '../../email/server/methods';
import { checkInsertUserId } from '../../helpers/server/methodServerHelpers';
import Security from '../../security/Security';
import ActivityService from '../../activities/server/ActivityService';
import SecurityService from '../../security';
import {
  loanInsert,
  loanUpdate,
  loanDelete,
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
  loanInsertBorrowers,
  adminLoanReset,
  loanLinkPromotion,
  loanUnlinkPromotion,
  loanSetCreatedAtActivityDescription,
  loanSetStatus,
  loanUpdateCreatedAt,
  sendLoanChecklist,
} from '../methodDefinitions';
import { STEPS, LOAN_STATUS } from '../loanConstants';
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

userLoanInsert.setHandler(({ userId }, { test, proPropertyId }) => {
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
    },
  });
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
  const {
    proPropertyId,
    existingAnonymousLoanId,
    referralId,
    trackingId,
  } = params;
  if (proPropertyId) {
    SecurityService.properties.isAllowedToAddAnonymousLoan({
      propertyId: proPropertyId,
    });
  }

  if (existingAnonymousLoanId) {
    // If an anonymous loan exists on the client, don't add another one
    // If a new property is requested on it, add it to the existing loan
    if (proPropertyId) {
      const existingLoan = LoanService.fetchOne({
        $filters: { _id: existingAnonymousLoanId },
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

loanInsertBorrowers.setHandler((context, params) => {
  const { loanId } = params;
  SecurityService.loans.isAllowedToUpdate(loanId);
  LoanService.insertBorrowers(params);
});

adminLoanReset.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LoanService.resetLoan(params);
});

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

loanSetStatus.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return LoanService.setStatus(params);
});

loanUpdateCreatedAt.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  const { loanId, createdAt } = params;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(createdAt);
  date.setHours(0, 0, 0, 0);

  if (date > today) {
    throw new Meteor.Error(
      'La date de création ne peut pas être dans le futur',
    );
  }

  LoanService.update({ loanId, object: { createdAt } });
  return ActivityService.updateCreatedAtActivity({ createdAt, loanId });
});

sendLoanChecklist.setHandler(({ userId }, { address, emailParams }) => {
  SecurityService.checkUserIsAdmin(userId);
  return sendEmailToAddress.run({
    address,
    emailId: EMAIL_IDS.LOAN_CHECKLIST,
    params: emailParams,
  });
});
