import { Mongo } from 'meteor/mongo';

import PartnerSchema from './schemas/partnerSchema';
import { PARTNERS_COLLECTION } from './partnersConstants';

const Partners = new Mongo.Collection(PARTNERS_COLLECTION);

Partners.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Partners.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

Partners.attachSchema(PartnerSchema);
export default Partners;
