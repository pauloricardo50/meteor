import {
  EventService,
  borrowerDelete,
  loanDelete,
  propertyDelete,
} from '../..';
import FileService from '../FileService';

EventService.addMethodListener(loanDelete, ({ loanId }) => {
  // TODO: Delete all files related to this borrower
});

EventService.addMethodListener(borrowerDelete, ({ borrowerId }) => {
  // TODO: Delete all files related to this borrower
});

EventService.addMethodListener(propertyDelete, ({ propertyId }) => {
  // TODO: Delete all files related to this property
});
