import SecurityService from '../../security';
import query from './sideNavBorrowers';

query.expose({
  firewall(userId) {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
