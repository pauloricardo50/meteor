import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';


import SecurityService from 'core/api/security';
import UserService from 'core/api/users/server/UserService';
import QueryCacher from 'core/api/helpers/server/QueryCacher';
import query from '../proLoans.test';
import { getLoanIds } from '../../server/resolvers';

query.expose({
  firewall(userId, params) {
    const { userId: providedUserId } = params;
    params.calledByUserId = userId;

    if (SecurityService.isUserAdmin(userId) && providedUserId) {
      params.userId = providedUserId;
    } else {
      params.userId = userId;
    }

    SecurityService.checkUserIsPro(userId);
  },
  validateParams: {
    promotionId: Match.Maybe(Match.OneOf(String, Object)),
    propertyId: Match.Maybe(Match.OneOf(String, Object)),
    userId: String,
    calledByUserId: String,
  },
});

const resolver = (params) => {
  const { userId } = params;
  const users = UserService.fetch({
    $filters: { referredByUserLink: userId },
    loans: { _id: 1 },
  });

  const loans = users.reduce(
    (allLoans, { loans: userLoans = [] }) => [
      ...allLoans,
      ...userLoans.map(({ _id }) => _id),
    ],
    [],
  );

  return loans;
};

query.resolve((params) => {
  Meteor._sleepForMs(500);
  return resolver(params);
});

const cacher = new QueryCacher({
  getDataToHash: getLoanIds({ withReferredBy: true }),
  ttl: 60 * 60 * 1000,
});

query.cacheResults(cacher);
