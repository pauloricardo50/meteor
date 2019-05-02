import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../promotionConstants';
import { adminPromotions } from '../../fragments';

export default Promotions.createQuery(
  PROMOTION_QUERIES.ADMIN_PROMOTIONS,
  adminPromotions(),
);
