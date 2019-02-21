import PromotionOptions from '../promotionOptions';
import { PROMOTION_OPTION_QUERIES } from '../promotionOptionConstants';

export default PromotionOptions.createQuery(
  PROMOTION_OPTION_QUERIES.PRO_PROMOTION_OPTIONS,
  () => {},
);
