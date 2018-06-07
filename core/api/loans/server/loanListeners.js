import { ServerEventService } from '../../events';
import LoanService from '../../loans/LoanService';
import { requestLoanVerification } from '../methodDefinitions';

export const disableUserFormsListener = ({ loanId }) => {
  LoanService.disableUserForms({ loanId });
};

ServerEventService.addMethodListener(
  requestLoanVerification,
  disableUserFormsListener,
);
