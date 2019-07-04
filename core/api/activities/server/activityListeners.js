import ServerEventService from '../../events/server/ServerEventService';
import { removeLoanFromPromotion } from '../../methods';
import { ACTIVITY_SECONDARY_TYPES } from '../activityConstants';
import UserService from '../../users/server/UserService';
import PromotionService from '../../promotions/server/PromotionService';
import ActivityService from './ActivityService';

ServerEventService.addMethodListener(
  removeLoanFromPromotion,
  ({ params: { loanId, promotionId }, context: { userId } }) => {
    const { name } = PromotionService.fetchOne({
      $filters: { _id: promotionId },
      name: 1,
    });
    const { name: userName } = UserService.fetchOne({
      $filters: { _id: userId },
      name: 1,
    }) || {};

    ActivityService.addServerActivity({
      secondaryType: ACTIVITY_SECONDARY_TYPES.REMOVE_LOAN_FROM_PROMOTION,
      loanLink: { _id: loanId },
      title: `Enlevé de la promotion "${name}"`,
      description: userName ? `Par ${userName}` : '',
      createdBy: userId,
    });
  },
);
