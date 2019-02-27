import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './proPropertyLoans';
import { proPropertyLoansResolver } from './resolvers';

query.expose({
  firewall(userId, params) {
    const { propertyId } = params;
    params.userId = userId;
    SecurityService.checkUserIsPro(userId);

    SecurityService.properties.isAllowedToView({ propertyId, userId });
  },
  validateParams: {
    propertyId: Match.OneOf(String, Object),
    userId: String,
  },
});

query.resolve(({ userId, propertyId }) =>
  proPropertyLoansResolver({ calledByUserId: userId, propertyId }));
