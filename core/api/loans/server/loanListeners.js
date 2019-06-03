import ServerEventService from '../../events/server/ServerEventService';
import LoanService from './LoanService';
import { requestLoanVerification } from '../..';

export const disableUserFormsListener = ({ params: { loanId } }) => {
  LoanService.update({ loanId, object: { userFormsEnabled: false } });
};

ServerEventService.addMethodListener(
  requestLoanVerification,
  disableUserFormsListener,
);
