import LenderRulesSchema from './schemas/lenderRulesSchema';
import { LENDER_RULES_COLLECTION } from './lenderRulesConstants';
import { createCollection } from '../helpers/collectionHelpers';

const LenderRules = createCollection(LENDER_RULES_COLLECTION);

LenderRules.attachSchema(LenderRulesSchema);
export default LenderRules;
