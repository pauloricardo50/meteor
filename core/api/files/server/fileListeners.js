import { borrowerDelete, loanDelete, propertyDelete } from '../..';
import ServerEventService from '../../events/server/ServerEventService';
import FileService from '../FileService';

ServerEventService.addMethodListener(loanDelete, ({ loanId }) => {
  // TODO: Delete all files related to this borrower
});

ServerEventService.addMethodListener(borrowerDelete, ({ borrowerId }) => {
  // TODO: Delete all files related to this borrower
});

ServerEventService.addMethodListener(propertyDelete, ({ propertyId }) => {
  // TODO: Delete all files related to this property
});
