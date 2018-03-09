import Security from '../../security';
import query from './tasksList';

query.expose({
  firewall(userId) {
    Security.checkCurrentUserIsAdmin();
  },
});
