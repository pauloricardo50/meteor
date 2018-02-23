import SecurityService from '../../security';
import query from './borrowersList';

query.expose({
  firewall(userId) {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
