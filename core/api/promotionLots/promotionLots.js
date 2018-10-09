import { Mongo } from 'meteor/mongo';

import PromotionLotSchema from './schemas/PromotionLotSchema';
import { PROMOTION_LOT_COLLECTION } from './promotionLotConstants';

const PromotionLots = new Mongo.Collection(PROMOTION_LOT_COLLECTION);

PromotionLots.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

PromotionLots.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

PromotionLots.attachSchema(PromotionLotSchema);
export default PromotionLots;
