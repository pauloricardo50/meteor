import { inviteUserToPromotion } from '../../../methods';
import { withMeteorUserId } from '../helpers';

const inviteUserToPromotionAPI = ({ user: { _id: userId }, body }) => {
  const { promotionId, user, testing } = body;

  if (testing) {
    return {
      message: `Test mode: user "${
        user.email
      }" would've been successfully invited to promotion id "${promotionId}"! Yay :)`,
    };
  }

  return withMeteorUserId(userId, () =>
    inviteUserToPromotion.run({
      promotionId,
      user: { ...user, invitedBy: userId },
    })).then(() => ({
    message: `Successfully invited user "${
      user.email
    }" to promotion id "${promotionId}"`,
  }));
};

export default inviteUserToPromotionAPI;
