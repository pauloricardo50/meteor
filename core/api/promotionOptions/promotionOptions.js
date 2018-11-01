import { Mongo } from 'meteor/mongo';

import PromotionOptionSchema from './schemas/PromotionOptionSchema';
import { PROMOTION_OPTIONS_COLLECTION } from './promotionOptionConstants';

const PromotionOptions = new Mongo.Collection(PROMOTION_OPTIONS_COLLECTION);

PromotionOptions.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

PromotionOptions.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

PromotionOptions.attachSchema(PromotionOptionSchema);
export default PromotionOptions;
