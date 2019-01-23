import SecurityService from '../../security';
import query from './loanLenders'; // Modify this line once you renamed your query file

query.expose({
  firewall(userId, { loanId }) {
    if (!SecurityService.isUserAdmin(userId)) {
      SecurityService.loans.isAllowedToUpdate(loanId);
    }
  },
  validateParams: { loanId: String },
});
