import SecurityService from '../../security';
import query from './adminLoansList';

query.expose({
  firewall(userId) {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
