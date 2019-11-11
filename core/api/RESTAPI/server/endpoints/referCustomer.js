import SimpleSchema from 'simpl-schema';

import { proInviteUser } from '../../../methods';
import { withMeteorUserId, updateCustomerReferral } from '../helpers';
import { checkQuery } from './helpers';

const querySchema = new SimpleSchema({
  'impersonate-user': { type: String, optional: true },
});

const referCustomerAPI = ({ user: { _id: userId }, body, query }) => {
  const { user, shareSolvency, invitationNote } = body;
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: querySchema,
  });

  return withMeteorUserId({ userId, impersonateUser }, () =>
    proInviteUser.run({
      user: { ...user, invitedBy: userId },
      shareSolvency,
      invitationNote,
    }),
  )
    .then(() =>
      updateCustomerReferral({ customer: user, userId, impersonateUser }),
    )
    .then(() => ({
      message: `Successfully referred user "${user.email}"`,
    }));
};

export default referCustomerAPI;
