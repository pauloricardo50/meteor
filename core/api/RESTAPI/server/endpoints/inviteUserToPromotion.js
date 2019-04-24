import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';

const inviteUserToPromotionAPI = ({
  user: { _id: userId },
  body,
  params,
  query,
}) => {
  const { user, shareSolvency = false } = body;
  const { promotionId } = params;
  const { impersonateUser } = query; // TODO: Implement this

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
