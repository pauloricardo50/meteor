import SecurityService from '../../security';
import query from './adminBorrowers';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
