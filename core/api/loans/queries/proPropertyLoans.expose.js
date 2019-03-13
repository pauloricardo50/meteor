import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './proPropertyLoans';
import { proPropertyLoansResolver, getLoanIds } from './resolvers';
import QueryCacher from '../../helpers/server/QueryCacher';

query.expose({
  firewall(userId, params) {
    const { propertyId } = params;
    params.userId = userId;
    SecurityService.checkUserIsPro(userId);
    SecurityService.properties.isAllowedToView({ propertyId, userId });
  },
  validateParams: {
    propertyId: String,
    userId: String,
  },
});

query.resolve(({ userId, propertyId }) =>
  proPropertyLoansResolver({ calledByUserId: userId, propertyId }));

const cacher = new QueryCacher({
  getDataToHash: getLoanIds(),
  ttl: 60 * 60 * 1000,
});

query.cacheResults(cacher);
