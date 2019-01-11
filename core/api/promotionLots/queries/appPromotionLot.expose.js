import SecurityService from '../../security';
import query from './appPromotionLot';

query.expose({
  firewall(userId, { promotionLotId }) {
    SecurityService.promotions.isAllowedToReadPromotionLot(
      promotionLotId,
      userId,
    );
  },
  validateParams: { promotionLotId: String },
});
