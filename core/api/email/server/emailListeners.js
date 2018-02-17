import { EventService, mutations } from '../..';
import EmailService from '../EmailService';

EventService.addMutationListener(mutations.START_AUCTION, ({ loanId }) => {
  EmailService.sendEmail({});
});
