import SecurityService from '../../security';
import { proPromotion } from '../../fragments';
import { makePromotionLotAnonymizer } from '../server/promotionServerHelpers';
import PromotionService from '../server/PromotionService';
import query from './proPromotion';

query.expose({
  firewall(userId, params) {
    const { promotionId } = params;
    params.userId = userId;
    SecurityService.checkUserIsPro(userId);
    SecurityService.promotions.isAllowedToView({
      promotionId,
      userId,
    });
  },
  validateParams: { promotionId: String, userId: String },
});

query.resolve(({ userId, promotionId }) => {
  const promotion = PromotionService.fetchOne({
    $filters: { _id: promotionId },
    ...proPromotion(),
  });

  try {
    SecurityService.checkCurrentUserIsAdmin();
    return [promotion];
  } catch (error) {
    const { promotionLots = [], ...rest } = promotion;
    return [
      {
        promotionLots: promotionLots.map(makePromotionLotAnonymizer({ userId })),
        ...rest,
      },
    ];
  }
});
