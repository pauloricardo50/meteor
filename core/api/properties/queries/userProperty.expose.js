import Security from '../../security';
import query from './userProperty';

query.expose({
  firewall(userId, { propertyId }) {
    Security.properties.hasAccessToProperty({ propertyId, userId });
  },
  validateParams: { propertyId: String },
});
