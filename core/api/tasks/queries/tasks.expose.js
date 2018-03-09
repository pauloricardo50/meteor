import SecurityService from '../../security';
import query from './tasks';

query.expose({
  firewall(userId) {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
