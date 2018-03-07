import SecurityService from '../../security';
import query from './loanTasksList';

query.expose({
  firewall(userId) {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
