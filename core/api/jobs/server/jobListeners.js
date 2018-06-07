import moment from 'moment';
import { ServerEventService } from '../../events';
import { startAuction, endAuction } from '../../methods';
import JobService from './JobService';
import { getAuctionEndTime } from '../../../utils/loanFunctions';

ServerEventService.addMethodListener(startAuction, (params) => {
  JobService.cancelExistingMethodJob({
    method: endAuction,
    params,
  });

  JobService.scheduleMethod({
    method: endAuction,
    params,
    date: getAuctionEndTime(moment()),
  });
});
