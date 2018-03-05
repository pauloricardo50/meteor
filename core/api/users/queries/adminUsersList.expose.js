import SecurityService from '../../security';
import query from './adminUsersList';

query.expose({
  firewall(userId) {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
