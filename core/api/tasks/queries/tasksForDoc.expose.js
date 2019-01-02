import SecurityService from '../../security';
import query from './tasksForDoc';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
  validateParams: { docIds: [String] },
});
