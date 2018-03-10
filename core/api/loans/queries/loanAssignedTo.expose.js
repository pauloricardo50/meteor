import Security from 'core/api/security';
import query from './loanAssignedTo';

query.expose({
  firewall(userId, params) {
    Security.checkCurrentUserIsAdmin(userId);
  },
});
