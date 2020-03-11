import { insuranceInsert } from '../methodDefinitions';
import Security from '../../security/Security';
import InsuranceService from './InsuranceService';

insuranceInsert.setHandler((context, params) => {
  Security.checkCurrentUserIsAdmin();
  return InsuranceService.insert(params);
});
