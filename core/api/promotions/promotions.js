import PromotionSchema from './schemas/PromotionSchema';
import { PROMOTIONS_COLLECTION } from './promotionConstants';
import { createCollection } from '../helpers/collectionHelpers';

const Promotions = createCollection(PROMOTIONS_COLLECTION);

Promotions.attachSchema(PromotionSchema);
export default Promotions;
