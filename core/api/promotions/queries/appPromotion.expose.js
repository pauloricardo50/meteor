import SecurityService from '../../security';
import query from './appPromotion';
import { PROMOTION_STATUS } from '../promotionConstants';

query.expose({
  firewall(userId, { promotionId }) {
    SecurityService.promotions.isAllowedToRead(promotionId, userId);
  },
  embody: {
    $filter({ filters, params }) {
      filters._id = params.promotionId;
      filters.status = PROMOTION_STATUS.OPEN;
    },
  },
  validateParams: { promotionId: String, loanId: String },
});
