import SecurityService from '../../security';
import {
  lenderRulesInitialize,
  lenderRulesInsert,
  lenderRulesRemove,
  lenderRulesUpdate,
  lenderRulesUpdateFilter,
  setLenderRulesOrder,
} from '../methodDefinitions';
import LenderRulesService from './LenderRulesService';

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

lenderRulesUpdateFilter.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderRulesService.updateFilter(params);
});

setLenderRulesOrder.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return LenderRulesService.setOrder(params);
});
