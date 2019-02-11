import SecurityService from '../../security';
import query from './proPromotion';
import PromotionService from '../server/PromotionService';
import { proPromotion } from '../../fragments';
import { handlePromotionLotsAnonymization } from '../server/promotionServerHelpers';

query.expose({
  firewall(userId, params) {
    const { promotionId } = params;
    params.userId = userId;
    SecurityService.checkUserIsPro(userId);
    SecurityService.promotions.isAllowedToViewPromotion({
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
    const { promotionLots, ...rest } = promotion;
    return [
      {
        promotionLots: handlePromotionLotsAnonymization({
          promotionLots,
          userId,
        }),
        ...rest,
      },
    ];
  }
});
