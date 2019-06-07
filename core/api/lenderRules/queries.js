import { lenderRules } from '../fragments';
import { LENDER_RULES_QUERIES } from './lenderRulesConstants';
import LenderRules from '.';

export const organisationLenderRules = LenderRules.createQuery(
  LENDER_RULES_QUERIES.ORGANISATION_LENDER_RULES,
  lenderRules(),
);
