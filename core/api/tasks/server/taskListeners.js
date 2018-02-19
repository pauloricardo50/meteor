import EventService from '../../events';
import { mutations } from '../../mutations';
import TaskService from '../TaskService';

EventService.addMutationListener(mutations.LOAN_DELETE, ({ loanId }) => {
  // TODO: remove parent loan for these tasks
});

EventService.addMutationListener(
  mutations.REQUEST_LOAN_VERIFICATION,
  ({ loanId }) => {
    // TODO: ADMIN_ACTION_TYPE.VERIFY
  },
);

EventService.addMutationListener(mutations.START_AUCTION, ({ loanId }) => {
  // TODO: ADMIN_ACTION_TYPE.AUCTION
});

EventService.addMutationListener(mutations.END_AUCTION, ({ loanId }) => {
  // TODO: complete auction task
});

EventService.addMutationListener(mutations.CANCEL_AUCTION, ({ loanId }) => {
  // TODO: remove auction task
});
