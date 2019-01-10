import SecurityService from '../../security';
import query from './promotionFiles';

query.expose({
  firewall(userId, { promotionId }) {
    SecurityService.promotions.isAllowedToRead(promotionId, userId);
  },
  validateParams: { promotionId: String },
});
