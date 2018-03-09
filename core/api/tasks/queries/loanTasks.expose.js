import SecurityService from '../../security';
import query from './loanTasks';

query.expose({
  firewall(userId) {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
