import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../promotionConstants';
import { proPromotions } from '../../fragments';

export default Promotions.createQuery(PROMOTION_QUERIES.PRO_PROMOTIONS, {
  ...proPromotions(),
});
