import { Mongo } from 'meteor/mongo';

import LenderRulesSchema from './schemas/lenderRulesSchema';
import { LENDER_RULES_COLLECTION } from './lenderRulesConstants';

const LenderRules = new Mongo.Collection(LENDER_RULES_COLLECTION);

LenderRules.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

LenderRules.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

LenderRules.attachSchema(LenderRulesSchema);
export default LenderRules;
