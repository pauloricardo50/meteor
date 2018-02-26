import Security from 'core/api/security';
import query from './adminUsersList';

query.expose({
  firewall(userId) {
    Security.checkCurrentUserIsAdmin(userId);
  },
});
