import SimpleSchema from 'simpl-schema';

import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';
import { getImpersonateUserId, checkQuery } from './helpers';
import UserService from '../../../users/server/UserService';

const querySchema = new SimpleSchema({
  'impersonate-user': { type: String, optional: true },
});

const referCustomerAPI = ({ user: { _id: userId }, body, query }) => {
  const { user, shareSolvency } = body;
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: querySchema,
  });

  let proId;
  if (impersonateUser) {
    proId = getImpersonateUserId({ userId, impersonateUser });
  }

  return withMeteorUserId(proId || userId, () =>
    proInviteUser.run({
      user: { ...user, invitedBy: userId },
      shareSolvency,
    }))
    .then(() => {
      if (impersonateUser) {
        const customerId = UserService.getByEmail(user.email)._id;
        return UserService.setReferredByOrganisation({
          userId: customerId,
          organisationId: UserService.getUserMainOrganisationId(userId),
        });
      }
      return Promise.resolve();
    })
    .then(() => ({
      message: `Successfully referred user "${user.email}"`,
    }));
};

export default referCustomerAPI;
