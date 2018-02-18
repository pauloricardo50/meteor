import { EventService, mutations } from '../..';
import FileService from '../FileService';

EventService.addMutationListener(
  mutations.BORROWER_DELETE,
  ({ borrowerId }) => {
    // TODO: Delete all files related to this borrower
  },
);

EventService.addMutationListener(mutations.LOAN_DELETE, ({ loanId }) => {
  // TODO: Delete all files related to this borrower
});

EventService.addMutationListener(
  mutations.PROPERTY_DELETE,
  ({ propertyId }) => {
    // TODO: Delete all files related to this property
  },
);
