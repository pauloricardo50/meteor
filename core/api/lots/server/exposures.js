import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { lots } from '../queries';

exposeQuery({
  query: lots,
  overrides: {
    firewall(userId, { promotionId }) {
      SecurityService.promotions.hasAccessToPromotion({ promotionId, userId });
    },
    embody: body => {
      body.$filter = ({ filters, params: { promotionId } }) => {
        filters['promotionCache.0._id'] = promotionId;
      };
    },
    validateParams: { promotionId: String },
  },
});
