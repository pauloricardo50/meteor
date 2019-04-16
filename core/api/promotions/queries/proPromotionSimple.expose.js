import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './proPromotionSimple';

query.expose({
  firewall(userId, params) {
    const { promotionId } = params;
    SecurityService.checkUserIsPro(userId);
    SecurityService.promotions.isAllowedToView({
      promotionId,
      userId,
    });
  },
  validateParams: { promotionId: String, $body: Match.Maybe(Object) },
  embody: {
    $filter({ filters, params: { promotionId } }) {
      filters._id = promotionId;
    },
  },
});
