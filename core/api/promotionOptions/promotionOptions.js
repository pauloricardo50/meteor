import { createCollection } from '../helpers/collectionHelpers';
import { PROMOTION_OPTIONS_COLLECTION } from './promotionOptionConstants';
import PromotionOptionSchema from './schemas/PromotionOptionSchema';

const PromotionOptions = createCollection(
  PROMOTION_OPTIONS_COLLECTION,
  PromotionOptionSchema,
);

export default PromotionOptions;
