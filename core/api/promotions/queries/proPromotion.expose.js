import SecurityService from '../../security';
import query from './proPromotion';

query.expose({
  firewall(userId, { promotionId }) {
    SecurityService.checkUserIsPro(userId);
    // SecurityService.promotions.isAllowedToRead(promotionId, userId);
  },
  validateParams: { promotionId: String },
});
