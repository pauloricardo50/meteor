import { Mongo } from 'meteor/mongo';

import LotSchema from './schemas/LotSchema';
import { LOTS_COLLECTION } from './lotConstants';

const Lots = new Mongo.Collection(LOTS_COLLECTION);

Lots.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Lots.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Lots.attachSchema(LotSchema);
export default Lots;
