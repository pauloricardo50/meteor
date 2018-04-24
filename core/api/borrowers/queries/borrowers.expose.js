import SecurityService from '../../security';
import query from './borrowers';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
