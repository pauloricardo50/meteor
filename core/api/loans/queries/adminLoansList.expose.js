import Security from 'core/api/security';
import query from './adminLoansList';

query.expose({
  firewall(userId) {
    Security.checkCurrentUserIsAdmin(userId);
  },
});
