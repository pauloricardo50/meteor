import SecurityService from '../../security';
import query from './offers';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
