import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';
import { getImpersonateUserId, getUserMainOrganisationId } from './helpers';
import UserService from '../../../users/server/UserService';

const referCustomerAPI = ({ user: { _id: userId }, body, query }) => {
  const { user } = body;
  const { 'impersonate-user': impersonateUser } = query;

  let proId;
  if (impersonateUser) {
    proId = getImpersonateUserId({ userId, impersonateUser });
  }

  return withMeteorUserId(proId || userId, () =>
    proInviteUser.run({
      user: { ...user, invitedBy: userId },
    }))
    .then(() => {
      const customerId = UserService.getByEmail(user.email)._id;
      return UserService.setReferredByOrganisation({
        userId: customerId,
        organisationId: getUserMainOrganisationId(userId),
      });
    })
    .then(() => ({
      message: `Successfully referred user "${user.email}"`,
    }));
};

export default referCustomerAPI;
