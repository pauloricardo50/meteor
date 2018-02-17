import { EventService, mutations } from '../..';
import TaskService from '../TaskService';

EventService.addMutationListener(mutations.START_AUCTION, ({ loanId }) => {
  // TODO
});
