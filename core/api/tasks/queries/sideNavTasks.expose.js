import SecurityService from '../../security';
import query from './sideNavTasks';

query.expose({
  firewall(userId) {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
