import { Match } from 'meteor/check';

import Security from '../../security';
import query from './proOrganisationProperties';
import { proPropertySummary } from '../../fragments';
import UserService from '../../users/server/UserService';
import PropertyService from '../server/PropertyService';

query.expose({
  firewall(userId, params) {
    if (params.userId) {
      // When visiting a pro user's page from admin
      Security.checkUserIsAdmin(userId);
    } else {
      Security.checkUserIsPro(userId);
      params.userId = userId;
    }
  },
  validateParams: { userId: Match.Maybe(String) },
});

query.resolve(({ userId }) => {
  const { organisations = [] } = UserService.fetchOne({
    $filters: { _id: userId },
    organisations: { users: { _id: 1 } },
  });

  const otherOrganisationUsers = !!organisations.length
    && organisations[0].users.map(({ _id }) => _id).filter(id => id !== userId);

  const properties = PropertyService.fetch({
    $filters: {
      $and: [
        { 'userLinks._id': { $in: otherOrganisationUsers } },
        { 'userLinks._id': { $nin: [userId] } },
      ],
    },
    ...proPropertySummary(),
  });

  return properties;
});
