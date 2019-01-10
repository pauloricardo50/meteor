import ServerEventService from '../../events/server/ServerEventService';
import LoanService from './LoanService';
import { requestLoanVerification } from '../..';

export const disableUserFormsListener = ({ loanId }) => {
  LoanService.disableUserForms({ loanId });
};

ServerEventService.addMethodListener(
  requestLoanVerification,
  disableUserFormsListener,
);
