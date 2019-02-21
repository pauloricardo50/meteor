import SecurityService from '../../security';
import query from './appPromotionOption';

query.expose({
  firewall(userId, { promotionOptionId }) {
    SecurityService.promotions.hasAccessToPromotionOption({
      promotionOptionId,
      userId,
    });
  },
  validateParams: { promotionOptionId: String },
});
