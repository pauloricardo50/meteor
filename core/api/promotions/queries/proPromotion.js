import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../promotionConstants';

export default Promotions.createQuery(
  PROMOTION_QUERIES.PRO_PROMOTION,
  () => {},
);
