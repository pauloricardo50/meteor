import SecurityService from '../../security';
import LenderRulesService from './LenderRulesService';
import { lenderRulesInsert, lenderRulesRemove, lenderRulesUpdate } from '../methodDefinitions';

lenderRulesInsert.setHandler((context, { lenderRules }) =>
// Add security checks
// Example
// SecurityService.checkCurrentUserIsAdmin();
  LenderRulesService.insert(lenderRules));

lenderRulesRemove.setHandler((context, { lenderRulesId }) =>
// Add security checks
// Example
// SecurityService.checkCurrentUserIsAdmin();
  LenderRulesService.remove(lenderRulesId));

lenderRulesUpdate.setHandler((context, { lenderRulesId, object }) =>
// Add security checks
// Example
// SecurityService.checkCurrentUserIsAdmin();
  LenderRulesService._update({ id: lenderRulesId, object }));
