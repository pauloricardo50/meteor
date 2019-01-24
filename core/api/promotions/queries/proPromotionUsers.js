import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../promotionConstants';
import { proPromotion } from '../../fragments';

export default Promotions.createQuery(PROMOTION_QUERIES.PRO_PROMOTION_USERS, {
  $filter({ filters, params: { promotionId } }) {
    filters._id = promotionId;
  },
  $postFilter(promotion = []) {
    const { users = [] } = !!promotion.length && promotion[0];
    return users;
  },
  users: { name: 1, organisations: { name: 1, users: { _id: 1 } } },
});
