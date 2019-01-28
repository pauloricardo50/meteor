import SecurityService from '../../security';
import LenderRulesService from './LenderRulesService';
import {
  lenderRulesInsert,
  lenderRulesRemove,
  lenderRulesUpdate,
  addLenderRulesFilter,
} from '../methodDefinitions';

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

addLenderRulesFilter.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderRulesService.addLenderRulesFilter(params);
});
