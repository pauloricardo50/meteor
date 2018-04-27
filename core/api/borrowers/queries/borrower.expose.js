import Security from 'core/api/security';
import query from './borrower';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
});
