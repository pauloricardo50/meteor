import Security from 'core/api/security';
import query from './tasksList';

query.expose({
  firewall(userId) {
    Security.checkAdmin(userId);
  },
});
