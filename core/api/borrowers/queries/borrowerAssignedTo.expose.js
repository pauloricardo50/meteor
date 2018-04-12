import Security from 'core/api/security';
import query from './borrowerAssignedTo';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
});
