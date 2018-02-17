import SecurityService from '../../security';
import { createMutator } from '../../mutations';
import LoanService from '../LoanService';
import * as defs from '../mutationDefinitions';

createMutator(defs.LOAN_INSERT, ({ object, userId }) => {
  SecurityService.loans.isAllowedToInsert();
  return LoanService.insert({ object, userId });
});

createMutator(defs.LOAN_UPDATE, ({ loanId, object }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.update({ loanId, object });
});

createMutator(defs.LOAN_DELETE, ({ loanId }) => {
  SecurityService.loans.isAllowedToDelete(loanId);
  return LoanService.delete({ loanId });
});

createMutator(defs.INCREMENT_LOAN_STEP, ({ loanId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.incrementStep({ loanId });
});

createMutator(defs.REQUEST_LOAN_VERIFICATION, ({ loanId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.askVerification({ loanId });
});

createMutator(defs.START_AUCTION, ({ loanId }) => {
  SecurityService.loans.isAllowedToUpdate(loanId);
  return LoanService.startAuction({ loanId });
});

createMutator(defs.END_AUCTION, ({ loanId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LoanService.startAuction({ loanId });
});

createMutator(defs.CANCEL_AUCTION, ({ loanId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LoanService.startAuction({ loanId });
});

createMutator(defs.CONFIRM_CLOSING, ({ loanId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LoanService.confirmClosing({ loanId, object });
});
