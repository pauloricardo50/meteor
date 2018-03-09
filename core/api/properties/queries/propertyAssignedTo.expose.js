import Security from 'core/api/security';
import query from './propertyAssignedTo';

query.expose({
  firewall(userId) {
    Security.checkCurrentUserIsAdmin(userId);
  },
});
