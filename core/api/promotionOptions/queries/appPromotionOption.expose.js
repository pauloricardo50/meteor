import SecurityService from '../../security';
import query from './appPromotionOption';

query.expose({
  firewall(userId, { promotionOptionId }) {
    SecurityService.promotions.isAllowedToReadPromotionOption(
      promotionOptionId,
      userId,
    );
  },
  validateParams: { promotionOptionId: String },
});
