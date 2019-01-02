import Security from 'core/api/security';
import query from './adminBorrower';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
  validateParams: { _id: String },
});
