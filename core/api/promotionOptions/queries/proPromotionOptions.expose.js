import SecurityService from '../../security';
import query from './proPromotionOptions';

query.expose({
  firewall(userId, { promotionOptionIds }) {
    SecurityService.checkUserIsPro(userId);
    promotionOptionIds.forEach((id) => {
      SecurityService.promotions.isAllowedToReadPromotionOption(id);
    });
  },
  validateParams: { promotionOptionIds: [String] },
});
