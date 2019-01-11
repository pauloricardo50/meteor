import Security from '../../security';
import query from './adminProperty';

query.expose({
  firewall(userId) {
    Security.checkUserIsAdmin(userId);
  },
  validateParams: { propertyId: String },
});
