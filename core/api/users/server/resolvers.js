import UserService from './UserService';
import { proUser as proUserFragment } from '../../fragments';

export const proReferredByUsersResolver = ({
  userId,
  organisationId: providedOrganisationId,
}) => {
  let organisationId;
  if (!providedOrganisationId) {
    const { organisations = [] } = UserService.fetchOne({
      $filters: { _id: userId },
      organisations: { _id: 1 },
    });
    organisationId = !!organisations.length && organisations[0]._id;
  } else {
    organisationId = providedOrganisationId;
  }

  const users = UserService.fetch({
    $filters: {
      $or: [
        { referredByUserLink: userId },
        organisationId && { referredByOrganisationLink: organisationId },
      ].filter(x => x),
    },
    ...proUserFragment(),
  });

  return users;
};
