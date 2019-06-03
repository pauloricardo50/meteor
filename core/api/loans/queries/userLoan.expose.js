import { Match } from 'meteor/check';

import SecurityService from 'core/api/security';
import userLoan from './userLoan';

userLoan.expose({
  firewall(userId, params) {
    params.userId = userId;

    if (!userId) {
      SecurityService.loans.checkAnonymousLoan(params.loanId);
    }
  },
  embody: {
    $filter({ filters, params }) {
      filters.userId = params.userId;
      filters._id = params.loanId;
    },
  },
  validateParams: { loanId: Match.Maybe(String), userId: Match.Maybe(String) },
});
