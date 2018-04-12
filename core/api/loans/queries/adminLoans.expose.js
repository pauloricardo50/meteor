import SecurityService from '../../security';
import query from './adminLoans';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
