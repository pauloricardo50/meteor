import SecurityService from '../../security';
import query from './proPromotion';

query.expose({
  firewall(userId) {
    // TODO:
    // SecurityService.checkUserIsPro(userId);
  },
  validateParams: { promotionId: String },
});
