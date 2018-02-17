import { EventService, mutations } from '../..';

EventService.addMutationListener(mutations.START_AUCTION, ({ loanId }) => {
  // Schedule END_AUCTION mutation here
});
