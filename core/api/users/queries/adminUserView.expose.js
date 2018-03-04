import SecurityService from '../../security';
import query from './adminUserView';

query.expose({
  firewall(userId) {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
