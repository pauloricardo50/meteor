import SecurityService from '../../security';
import query from './loanFiles';

query.expose({
  firewall(userId, { loanId }) {
    SecurityService.loans.isAllowedToUpdate(loanId);
  },
});
