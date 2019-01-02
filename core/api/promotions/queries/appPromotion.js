import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../promotionConstants';
import { proPromotion } from '../../fragments';

export default Promotions.createQuery(
  PROMOTION_QUERIES.APP_PROMOTION,
  proPromotion({ withFilteredLoan: true }),
);
