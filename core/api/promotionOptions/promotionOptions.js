import PromotionOptionSchema from './schemas/PromotionOptionSchema';
import { PROMOTION_OPTIONS_COLLECTION } from './promotionOptionConstants';
import { createCollection } from '../helpers/collectionHelpers';

const PromotionOptions = createCollection(PROMOTION_OPTIONS_COLLECTION);

PromotionOptions.attachSchema(PromotionOptionSchema);
export default PromotionOptions;
