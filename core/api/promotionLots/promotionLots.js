import { createCollection } from '../helpers/collectionHelpers';
import { PROMOTION_LOTS_COLLECTION } from './promotionLotConstants';
import PromotionLotSchema from './schemas/PromotionLotSchema';

const PromotionLots = createCollection(PROMOTION_LOTS_COLLECTION);

PromotionLots.attachSchema(PromotionLotSchema);
export default PromotionLots;
