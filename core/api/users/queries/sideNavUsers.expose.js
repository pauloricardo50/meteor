import SecurityService from '../../security';
import query from './sideNavUsers';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
