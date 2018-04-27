import Security from '../../security';
import query from './property';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
});
