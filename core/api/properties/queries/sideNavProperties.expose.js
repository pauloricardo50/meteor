import Security from '../../security';
import query from './sideNavProperties';

query.expose({
  firewall(userId) {
    Security.checkCurrentUserIsAdmin(userId);
  },
});
