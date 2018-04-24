import SecurityService from '../../security';
import query from './adminLoan';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
