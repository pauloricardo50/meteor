import { Mongo } from 'meteor/mongo';

import Irs10ySchema from './schemas/irs10ySchema';
import { IRS10Y_COLLECTION } from './irs10yConstants';

const Irs10y = new Mongo.Collection(IRS10Y_COLLECTION);

Irs10y.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Irs10y.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Irs10y.attachSchema(Irs10ySchema);
export default Irs10y;
