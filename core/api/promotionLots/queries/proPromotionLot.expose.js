import SecurityService from '../../security';
import query from './proPromotionLot';
import PromotionLotService from '../server/PromotionLotService';
import { proPromotionLot } from '../../fragments';
import { handlePromotionLotsAnonymization } from '../../promotions/server/promotionServerHelpers';

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
