import SecurityService from '../../security';
import {
  frontGetTag,
  frontTagLoan,
  frontUntagLoan,
} from '../methodDefiinitions';
import FrontService from './FrontService';

frontTagLoan.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return FrontService.tagLoan(params);
});

frontUntagLoan.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return FrontService.untagLoan(params);
});

frontGetTag.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return FrontService.getTag(params);
});
