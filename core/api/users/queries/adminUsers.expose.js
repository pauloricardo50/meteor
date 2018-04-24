import SecurityService from '../../security';
import query from './adminUsers';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
