import SecurityService from '../../security';
import query from './loanOffers';

query.expose({
  firewall(userId, { loanId }) {
    SecurityService.checkLoggedIn();

    if (loanId) {
      SecurityService.loans.isAllowedToUpdate(loanId);
    }
  },
  validateParams: { loanId: String },
});
