import { createCollection } from '../helpers/collectionHelpers';
import { PROMOTIONS_COLLECTION } from './promotionConstants';
import PromotionSchema from './schemas/PromotionSchema';

const Promotions = createCollection(PROMOTIONS_COLLECTION);

Promotions.attachSchema(PromotionSchema);
export default Promotions;
