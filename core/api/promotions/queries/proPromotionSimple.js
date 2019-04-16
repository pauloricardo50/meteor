import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../promotionConstants';

// This query is used to get quick info about a promotion, it should only include
// data that can be seen by someone who has access to "VIEW" the promotion
export default Promotions.createQuery(PROMOTION_QUERIES.PRO_PROMOTION_SIMPLE, {
  promotionLots: { name: 1 },
});
