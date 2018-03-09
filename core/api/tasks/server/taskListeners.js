import EventService from '../../events';
import {
  loanDelete,
  requestLoanVerification,
  startAuction,
  endAuction,
  cancelAuction,
} from '../../methods';
import TaskService from '../TaskService';

EventService.addMethodListener(loanDelete, (params) => {
  // TODO: remove parent loan for these tasks
});

EventService.addMethodListener(requestLoanVerification, (params) => {
  // TODO: ADMIN_ACTION_TYPE.VERIFY
});

EventService.addMethodListener(startAuction, (params) => {
  // TODO: ADMIN_ACTION_TYPE.AUCTION
});

EventService.addMethodListener(endAuction, (params) => {
  // TODO: complete auction task
});

EventService.addMethodListener(cancelAuction, (params) => {
  // TODO: remove auction task
});
