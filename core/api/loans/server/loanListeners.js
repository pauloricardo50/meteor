import EventService from '../../events';
import LoanService from '../../loans/LoanService';
import { requestLoanVerification } from '../methodDefinitions';

export const disableUserFormsListener = ({ loanId }) => {
  LoanService.disableUserForms({ loanId });
};
EventService.addMethodListener(
  requestLoanVerification,
  disableUserFormsListener,
);
