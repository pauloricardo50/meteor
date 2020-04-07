import { createCollection } from '../helpers/collectionHelpers';
import { LENDER_RULES_COLLECTION } from './lenderRulesConstants';
import LenderRulesSchema from './schemas/lenderRulesSchema';

const LenderRules = createCollection(LENDER_RULES_COLLECTION);

LenderRules.attachSchema(LenderRulesSchema);
export default LenderRules;
