import ServerEventService from '../../events/server/ServerEventService';
import {
  adminLoanInsert,
  assignLoanToUser,
  userLoanInsert,
} from '../../loans/methodDefinitions';
import LoanService from '../../loans/server/LoanService';
import FrontService from './FrontService';

ServerEventService.addAfterMethodListener(
  assignLoanToUser,
  ({ context, params: { loanId, userId } }) => {
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
  ({ context, result: loanId }) => {
    context.unblock();
    const { userId } = context;

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
  ({ context, params: { userId }, result: loanId }) => {
    context.unblock();

    if (!userId) {
      // Only tag loans that have a dedicated user
      return;
    }

    const { name: loanName } = LoanService.get(loanId, { name: 1 });

    FrontService.getLoanTagId({ loanId, loanName });
  },
);
