import Security from '../../security';
import query from './adminProperties';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
  validateParams: {},
});
