import SecurityService from '../../security';
import query from './loanSearch';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
