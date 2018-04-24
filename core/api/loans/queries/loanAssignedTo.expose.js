import Security from 'core/api/security';
import query from './loanAssignedTo';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
});
