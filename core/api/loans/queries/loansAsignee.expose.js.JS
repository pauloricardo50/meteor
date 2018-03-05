import Security from 'core/api/security';
import query from './loanAsignee';

query.expose({
  firewall(userId, params) {
    Security.checkCurrentUserIsAdmin(userId);
  },
});
