import SecurityService from '../../security';
import query from './proPromotionUsers';

query.expose({
  firewall(userId, { promotionId }) {
    SecurityService.promotions.hasAccessToPromotion({ promotionId, userId });
  },
  validateParams: { promotionId: String },
});
