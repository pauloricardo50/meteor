import SecurityService from '../../security';
import LenderRulesService from './LenderRulesService';
import {
  lenderRulesInitialize,
  lenderRulesInsert,
  lenderRulesRemove,
  lenderRulesUpdate,
} from '../methodDefinitions';

lenderRulesInitialize.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderRulesService.initialize(params);
});

lenderRulesInsert.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderRulesService.insert(params);
});

lenderRulesRemove.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderRulesService.remove(params);
});

lenderRulesUpdate.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderRulesService.update(params);
});
