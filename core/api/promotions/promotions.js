import { Mongo } from 'meteor/mongo';

import PromotionSchema from './shcemas/PromotionSchema';
import { PROMOTIONS_COLLECTION } from './promotionConstants';

const Promotions = new Mongo.Collection(PROMOTIONS_COLLECTION);

Promotions.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Promotions.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Promotions.attachSchema(PromotionSchema);
export default Promotions;
