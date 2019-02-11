import PromotionOptions from '../promotionOptions';
import { PROMOTION_OPTION_QUERIES } from '../promotionOptionConstants';
import { proPromotionOption } from '../../fragments';

// export default PromotionOptions.createQuery(
//   PROMOTION_OPTION_QUERIES.PRO_PROMOTION_OPTIONS,
//   {
//     $filter({ filters, params: { promotionOptionIds } }) {
//       filters._id = { $in: promotionOptionIds };
//     },
//     ...proPromotionOption(),
//   },
// );

export default PromotionOptions.createQuery(
  PROMOTION_OPTION_QUERIES.PRO_PROMOTION_OPTIONS,
  () => {},
);
