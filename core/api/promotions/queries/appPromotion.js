import Promotions from '../promotions';
import { PROMOTION_QUERIES, PROMOTION_STATUS } from '../promotionConstants';
import { proPromotionFragment } from './promotionFragments';

export default Promotions.createQuery(PROMOTION_QUERIES.APP_PROMOTION, {
  $filter({ filters, params: { promotionId } }) {
    filters._id = promotionId;
    filters.status = PROMOTION_STATUS.OPEN;
  },
  ...proPromotionFragment,
  loans: {
    $filter({ filters, params: { loanId } }) {
      filters._id = loanId;
    },
  },
});
