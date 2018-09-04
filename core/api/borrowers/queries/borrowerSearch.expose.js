import SecurityService from '../../security';
import query from './borrowerSearch';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
