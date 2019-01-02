import SecurityService from '../../security';
import query from './proPromotions';

query.expose({
  firewall(userId, params) {
    SecurityService.checkUserIsPro(userId);
    params.userId = userId;
  },
  embody: {
    // This will deepExtend your body
    $filter({ filters, params }) {
      filters['userLinks._id'] = params.userId;
    },
  },
  validateParams: { userId: String },
});
