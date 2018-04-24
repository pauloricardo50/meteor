import Security from '../../security';
import query from './propertyAssignedTo';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
});
