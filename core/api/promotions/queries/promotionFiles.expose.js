import SecurityService from '../../security';
import query from './promotionFiles';

query.expose({
  firewall(userId, { promotionId }) {
    SecurityService.promotions.hasAccessToPromotion({ promotionId, userId });
  },
  validateParams: { promotionId: String },
});
