import SecurityService from '../../security';
import query from './loanWithName';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
