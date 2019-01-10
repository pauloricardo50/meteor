import SecurityService from '../../security';
import query from './promotionLotFiles';

query.expose({
  firewall(userId, { promotionLotId }) {
    SecurityService.promotions.isAllowedToReadPromotionLot(
      promotionLotId,
      userId,
    );
  },
  validateParams: { promotionLotId: String },
});
