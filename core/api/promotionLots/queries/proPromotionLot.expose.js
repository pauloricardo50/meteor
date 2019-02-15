import { handlePromotionLotsAnonymization } from '../../promotions/server/promotionServerHelpers';
import SecurityService from '../../security';
import { proPromotionLot } from '../../fragments';
import PromotionLotService from '../server/PromotionLotService';
import query from './proPromotionLot';

query.expose({
  firewall(userId, params) {
    const { promotionLotId } = params;
    params.userId = userId;
    SecurityService.checkUserIsPro(userId);
    SecurityService.promotions.isAllowedToViewPromotionLot({
      promotionLotId,
      userId,
    });
  },
  validateParams: { promotionLotId: String, userId: String },
});

query.resolve(({ userId, promotionLotId }) => {
  const promotionLot = PromotionLotService.fetchOne({
    $filters: { _id: promotionLotId },
    ...proPromotionLot(),
  });

  try {
    SecurityService.checkCurrentUserIsAdmin(userId);
    return [promotionLot];
  } catch (error) {
    return handlePromotionLotsAnonymization({
      promotionLots: [promotionLot],
      userId,
    });
  }
});
