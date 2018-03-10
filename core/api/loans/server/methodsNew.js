import { Meteor } from 'meteor/meteor';

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
} from '../methodDefinitions';

loanInsert.setHandler((context, { object, userId }) => {
  const userIdIsDefined = userId !== undefined;
  if (userIdIsDefined) {
    SecurityService.checkCurrentUserIsAdmin();
  } else {
    SecurityService.loans.isAllowedToInsert();
  }

  return LoanService.insert({
    object,
    userId: userIdIsDefined ? userId : Meteor.userId(),
  });
});

loanUpdate.setHandler((context, { loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.update({ loanId, object });
});

loanDelete.setHandler((context, { loanId }) => {
  SecurityService.loans.isAllowedToDelete(loanId);
  return LoanService.delete({ loanId });
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
