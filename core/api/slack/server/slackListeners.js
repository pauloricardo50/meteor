import ServerEventService from '../../events/server/ServerEventService';
import { inviteUserToPromotion } from '../../methods';
import SlackService from '../SlackService';
import PromotionService from '../../promotions/PromotionService';

ServerEventService.addMethodListener(
  inviteUserToPromotion,
  ({ promotionId, user }) => {
    const { name } = PromotionService.get(promotionId);
    const { firstName, lastName } = user;

    SlackService.send({
      text: `${firstName} ${lastName} invité à la promotion ${name}`,
    });
  },
);
