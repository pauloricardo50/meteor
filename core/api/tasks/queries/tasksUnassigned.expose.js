import Security from 'core/api/security';
import query from './tasksUnassigned';

query.expose({
  firewall(userId) {
    Security.checkCurrentUserIsAdmin(userId);
  },
});