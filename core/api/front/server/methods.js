import SecurityService from '../../security';
import { frontTagLoan, frontUntagLoan } from '../methodDefiinitions';
import FrontService from './FrontService';

frontTagLoan.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return FrontService.tagLoan(params);
});

frontUntagLoan.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return FrontService.untagLoan(params);
});
