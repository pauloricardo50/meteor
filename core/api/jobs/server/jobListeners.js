import EventService from '../../events';
import { mutations } from '../../mutations';

EventService.addMutationListener(mutations.START_AUCTION, (params) => {
  // Schedule END_AUCTION mutation here
});
