import { Meteor } from 'meteor/meteor';
import Promotions from '../promotions';
import { PROMOTION_QUERIES } from '../promotionConstants';
import { proPromotionsFragment } from './promotionFragments';

export default Promotions.createQuery(PROMOTION_QUERIES.PRO_PROMOTIONS, {
  $filter({ filters }) {
    filters['userLinks._id'] = Meteor.userId();
  },
  ...proPromotionsFragment,
});
