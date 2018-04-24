import Security from 'core/api/security';
import query from './unassignedTasks';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
});
