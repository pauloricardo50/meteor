import ServerEventService from '../../events/server/ServerEventService';
import LoanService from '../LoanService';
import { requestLoanVerification, borrowerDelete } from '../..';

export const disableUserFormsListener = ({ loanId }) => {
  LoanService.disableUserForms({ loanId });
};

ServerEventService.addMethodListener(
  requestLoanVerification,
  disableUserFormsListener,
);

ServerEventService.addMethodListener(borrowerDelete, ({ borrowerId }) => {
  LoanService.cleanupRemovedBorrower({ borrowerId });
});
