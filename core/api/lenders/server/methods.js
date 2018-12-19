import SecurityService from '../../security';
import LenderService from '../LenderService';
import { lenderInsert, lenderRemove, lenderUpdate } from '../methodDefinitions';

lenderInsert.setHandler((context, { lender }) => {
  // Add security checks
  // Example
  // SecurityService.checkCurrentUserIsAdmin();
  return LenderService.insert(lender);
});

lenderRemove.setHandler((context, { lenderId }) => {
  // Add security checks
  // Example
  // SecurityService.checkCurrentUserIsAdmin();
  return LenderService.remove(lenderId);
});

lenderUpdate.setHandler((context, { lenderId, object }) => {
  // Add security checks
  // Example
  // SecurityService.checkCurrentUserIsAdmin();
  return LenderService._update({ id: lenderId, object });
});
