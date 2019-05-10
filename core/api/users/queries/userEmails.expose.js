import SecurityService from '../../security';
import query from './userEmails';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
  validateParams: { _id: String },
});
