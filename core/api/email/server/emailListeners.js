import { EventService, mutations } from '../..';
import EmailService from '../EmailService';

EventService.addMutationListener(
  mutations.REQUEST_LOAN_VERIFICATION,
  ({ loanId }) => {
    EmailService.sendEmail({});
  },
);

EventService.addMutationListener(mutations.START_AUCTION, ({ loanId }) => {
  EmailService.sendEmail({});
});

EventService.addMutationListener(mutations.END_AUCTION, ({ loanId }) => {
  EmailService.sendEmail({});
});

EventService.addMutationListener(mutations.CANCEL_AUCTION, ({ loanId }) => {
  EmailService.sendEmail({});
});
