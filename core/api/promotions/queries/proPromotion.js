import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../promotionConstants';
import { proPromotion } from '../../fragments';

export default Promotions.createQuery(PROMOTION_QUERIES.PRO_PROMOTION, {
  $filter({ filters, params: { promotionId } }) {
    filters._id = promotionId;
  },
  ...proPromotion(),
});
