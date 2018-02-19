import EventService from '../../events';
import { mutations } from '../../mutations';
import TaskService from '../TaskService';

EventService.addMutationListener(mutations.LOAN_DELETE, (params) => {
  // TODO: remove parent loan for these tasks
});

EventService.addMutationListener(
  mutations.REQUEST_LOAN_VERIFICATION,
  (params) => {
    // TODO: ADMIN_ACTION_TYPE.VERIFY
  },
);

EventService.addMutationListener(mutations.START_AUCTION, (params) => {
  // TODO: ADMIN_ACTION_TYPE.AUCTION
});

EventService.addMutationListener(mutations.END_AUCTION, (params) => {
  // TODO: complete auction task
});

EventService.addMutationListener(mutations.CANCEL_AUCTION, (params) => {
  // TODO: remove auction task
});
