import { simpleUser } from 'core/api/fragments';
import SecurityService from '../../security';
import query from './proReferredByUsers';
import UserService from '../server/UserService';

query.expose({
  firewall(userId, params) {
    const { userId: providedUserId } = params;

    if (SecurityService.isUserAdmin(userId) && providedUserId) {
      params.userId = providedUserId;
    } else {
      params.userId = userId;
    }

    SecurityService.checkUserIsPro(userId);
  },
  validateParams: {
    userId: String,
  },
});

query.resolve(({ userId }) => {
  const { organisations = [] } = UserService.fetchOne({
    $filters: { _id: userId },
    organisations: { _id: 1 },
  });
  const organisationId = !!organisations.length && organisations[0]._id;

  const users = UserService.fetch({
    $filters: {
      $or: [
        { referredByUserLink: userId },
        organisationId && { referredByOrganisationLink: organisationId },
      ].filter(x => x),
    },
    ...simpleUser(),
  });

  return users;
});
