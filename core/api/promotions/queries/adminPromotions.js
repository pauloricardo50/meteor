import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../promotionConstants';
import { adminPromotionsFragment } from './promotionFragments';

export default Promotions.createQuery(PROMOTION_QUERIES.ADMIN_PROMOTIONS, {
  ...adminPromotionsFragment,
});
