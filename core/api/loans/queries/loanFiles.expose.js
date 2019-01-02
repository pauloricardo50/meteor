import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './loanFiles';

query.expose({
  firewall(userId, { loanId }) {
    SecurityService.loans.isAllowedToUpdate(loanId);
  },
  validateParams: {
    loanId: Match.Maybe(String),
    loanIds: Match.Maybe([String]),
  },
});
