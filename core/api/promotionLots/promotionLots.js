import PromotionLotSchema from './schemas/PromotionLotSchema';
import { PROMOTION_LOTS_COLLECTION } from './promotionLotConstants';
import { createCollection } from '../helpers/collectionHelpers';

const PromotionLots = createCollection(PROMOTION_LOTS_COLLECTION);

PromotionLots.attachSchema(PromotionLotSchema);
export default PromotionLots;
