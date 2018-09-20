import SecurityService from '../../security';
import query from './loansAssignedToAdmin';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
