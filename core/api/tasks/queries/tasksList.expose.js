import SecurityService from '../../security';
import query from './tasksList';

query.expose({
  firewall(userId) {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
