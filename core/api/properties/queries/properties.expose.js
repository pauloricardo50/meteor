import Security from '../../security';
import query from './properties';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
});
