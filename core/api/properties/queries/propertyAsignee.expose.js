import Security from 'core/api/security';
import query from './propertyAsignee';

query.expose({
  firewall(userId) {
    Security.checkCurrentUserIsAdmin(userId);
  },
});
