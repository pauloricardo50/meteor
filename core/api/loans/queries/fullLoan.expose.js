import SecurityService from '../../security';
import query from './fullLoan';

query.expose({
  firewall() {
    SecurityService.currentUserIsAdmin();
  },
  validateParams: { loanId: String },
});
