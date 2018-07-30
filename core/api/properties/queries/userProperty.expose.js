import Security from '../../security';
import query from './userProperty';

query.expose({
  firewall(userId, { propertyId }) {
    Security.property.isAlllowedToUpdate(propertyId);
  },
});
