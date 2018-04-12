import SecurityService from '../../security';
import query from './adminUser';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
