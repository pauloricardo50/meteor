import Security from '../../security';
import query from './propertySearch';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
});
