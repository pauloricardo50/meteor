import { Mongo } from 'meteor/mongo';

import LenderSchema from './schemas/lenderSchema';
import { LENDERS_COLLECTION } from './lenderConstants';

const Lenders = new Mongo.Collection(LENDERS_COLLECTION);

Lenders.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Lenders.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Lenders.attachSchema(LenderSchema);
export default Lenders;
