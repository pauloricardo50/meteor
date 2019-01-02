import Promotions from '../promotions';
import { PROMOTION_QUERIES, PROMOTION_STATUS } from '../promotionConstants';
import { proPromotion } from '../../fragments';

export default Promotions.createQuery(PROMOTION_QUERIES.APP_PROMOTION, {
  $filter({ filters, params: { promotionId } }) {
    filters._id = promotionId;
    filters.status = PROMOTION_STATUS.OPEN;
  },
  ...proPromotion({ withFilteredLoan: true }),
});
