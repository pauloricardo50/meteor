import SecurityService from '../../security';
import query from './adminLoanView';

query.expose({
  firewall(userId) {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
