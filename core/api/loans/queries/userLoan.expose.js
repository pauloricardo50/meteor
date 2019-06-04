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
  embody(body, embodyParams) {
    body.$filter = ({ filters, params }) => {
      filters.userId = params.userId;
      filters._id = params.loanId;
    };

    // FIXME: https://github.com/cult-of-coders/grapher/pull/363
    if (!embodyParams.userId) {
      body.maxPropertyValue = 0;
    } else {
      body.maxPropertyValueExists = 0;
    }
  },
  validateParams: { loanId: Match.Maybe(String), userId: Match.Maybe(String) },
});
