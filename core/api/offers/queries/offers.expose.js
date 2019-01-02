import { Match } from 'meteor/check';
import SecurityService from '../../security';
import query from './offers';

query.expose({
  firewall(userId, { loanId }) {
    SecurityService.checkLoggedIn();

    if (loanId) {
      SecurityService.loans.isAllowedToUpdate(loanId);
    }
  },
  validateParams: { loanId: Match.Maybe(String) },
});
