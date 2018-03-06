import moment from 'moment';
import EventService from '../../events';
import { mutations } from '../../mutations';
import JobService from './JobService';
import { getAuctionEndTime } from '../../../utils/loanFunctions';

EventService.addMutationListener(mutations.START_AUCTION, (params) => {
  JobService.cancelExistingMutationJob({
    mutation: mutations.END_AUCTION,
    params,
  });

  JobService.scheduleMutation({
    mutation: mutations.END_AUCTION,
    params,
    date: getAuctionEndTime(moment()),
  });
});
