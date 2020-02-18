import ServerEventService from '../../events/server/ServerEventService';
import LoanService from '../../loans/server/LoanService';
import FrontService from './FrontService';
import { assignLoanToUser, adminLoanInsert, userLoanInsert } from '../../loans';

ServerEventService.addAfterMethodListener(
  assignLoanToUser,
  ({ params: { loanId, userId } }) => {
    context.unblock();

    const { name: loanName, frontTagId } = LoanService.get(loanId, {
      frontTagId: 1,
      name: 1,
    });

    if (frontTagId) {
      return;
    }

    FrontService.getLoanTagId({ loanId, loanName });
  },
);

ServerEventService.addAfterMethodListener(
  userLoanInsert,
  ({ context: { userId }, result: loanId }) => {
    context.unblock();

    if (!userId) {
      // Only tag loans that have a dedicated user
      return;
    }

    const { name: loanName } = LoanService.get(loanId, { name: 1 });

    FrontService.getLoanTagId({ loanId, loanName });
  },
);

ServerEventService.addAfterMethodListener(
  adminLoanInsert,
  ({ params: { userId }, result: loanId }) => {
    context.unblock();

    if (!userId) {
      // Only tag loans that have a dedicated user
      return;
    }

    const { name: loanName } = LoanService.get(loanId, { name: 1 });

    FrontService.getLoanTagId({ loanId, loanName });
  },
);
