import { insuranceInsert, insuranceModify } from '../methodDefinitions';
import Security from '../../security/Security';
import InsuranceService from './InsuranceService';

insuranceInsert.setHandler((context, params) => {
  Security.checkCurrentUserIsAdmin();
  return InsuranceService.insert(params);
});

insuranceModify.setHandler((context, params) => {
  Security.checkCurrentUserIsAdmin();
  return InsuranceService.update(params);
});
