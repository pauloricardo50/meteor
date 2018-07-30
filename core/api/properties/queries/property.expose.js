import Security from '../../security';
import query from './userProperty';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
});
