import LenderRulesService from '../api/lenderRules/server/LenderRulesService';

export const createLenderRules = (organisationId) => {
  LenderRulesService.initialize({ organisationId });
};
