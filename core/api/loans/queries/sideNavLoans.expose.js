import SecurityService from '../../security';
import query from './sideNavLoans';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
