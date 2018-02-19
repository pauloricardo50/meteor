import Security from 'core/api/security';
import query from './adminUserView';

query.expose({
  firewall(userId) {
    Security.checkAdmin(userId);
  },
});
