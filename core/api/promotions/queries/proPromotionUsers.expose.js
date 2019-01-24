import SecurityService from '../../security';
import query from './proPromotionUsers';

query.expose({
  firewall(userId, { promotionId }) {
    SecurityService.checkUserIsPro(userId);
    SecurityService.promotions.isAllowedToRead(promotionId, userId);
  },
  validateParams: { promotionId: String },
});
