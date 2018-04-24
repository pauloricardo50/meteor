import moment from 'moment';
import EventService from '../../events';
import { startAuction, endAuction } from '../../methods';
import JobService from './JobService';
import { getAuctionEndTime } from '../../../utils/loanFunctions';

EventService.addMethodListener(startAuction, (params) => {
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
