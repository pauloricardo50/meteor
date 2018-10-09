import { Mongo } from 'meteor/mongo';

import PromotionOptionSchema from './schemas/PromotionOptionSchema';
import { PROMOTION_OPTION_COLLECTION } from './promotionOptionConstants';

const PromotionOptions = new Mongo.Collection(PROMOTION_OPTION_COLLECTION);

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
