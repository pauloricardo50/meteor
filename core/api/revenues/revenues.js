import { Mongo } from 'meteor/mongo';

import RevenueSchema from './schemas/revenueSchema';
import { REVENUES_COLLECTION } from './revenueConstants';

const Revenues = new Mongo.Collection(REVENUES_COLLECTION);

Revenues.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Revenues.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Revenues.attachSchema(RevenueSchema);
export default Revenues;
