import SimpleSchema from 'simpl-schema';

import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';
import { checkQuery } from './helpers';

const querySchema = new SimpleSchema({
  'impersonate-user': { type: String, optional: true },
});

const inviteUserToPromotionAPI = ({
  user: { _id: userId },
  body,
  params,
  query,
}) => {
  const { user, shareSolvency = false } = body;
  const { promotionId } = params;
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: querySchema,
  }); // TODO: implement this

  return withMeteorUserId(userId, () =>
    proInviteUser.run({
      promotionIds: [promotionId].filter(x => x),
      user: { ...user, invitedBy: userId },
      shareSolvency,
    })).then(() => ({
    message: `Successfully invited user "${
      user.email
    }" to promotion id "${promotionId}"`,
  }));
};

export default inviteUserToPromotionAPI;
