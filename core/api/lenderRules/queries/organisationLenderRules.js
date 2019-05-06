import { lenderRules } from '../../fragments';
import { LENDER_RULES_QUERIES } from '../lenderRulesConstants';
import LenderRules from '../lenderRules';

export default LenderRules.createQuery(
  LENDER_RULES_QUERIES.ORGANISATION_LENDER_RULES,
  lenderRules(),
);
