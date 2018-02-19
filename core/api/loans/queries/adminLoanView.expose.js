import Security from 'core/api/security';
import query from './adminLoanView';

query.expose({
  firewall(userId, params) {
    Security.checkAdmin(userId);
  },
});
