import SecurityService from '../../security';
import query from './admins';

query.expose({
  firewall(userId) {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
