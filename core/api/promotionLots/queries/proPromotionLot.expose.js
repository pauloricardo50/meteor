import SecurityService from '../../security';
import query from './proPromotionLot';

query.expose({
  firewall(userId, { promotionLotId }) {
    SecurityService.checkUserIsPro(userId);
    SecurityService.promotions.isAllowedToReadPromotionLot(
      promotionLotId,
      userId,
    );
  },
  validateParams: { promotionLotId: String },
});
