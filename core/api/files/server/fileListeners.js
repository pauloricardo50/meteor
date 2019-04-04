import { borrowerDelete, loanDelete, propertyDelete } from '../..';
import ServerEventService from '../../events/server/ServerEventService';
import FileService from '../FileService';

ServerEventService.addMethodListener(loanDelete, (context, { loanId }) => {
  // TODO: Delete all files related to this loan
});

ServerEventService.addMethodListener(
  borrowerDelete,
  (context, { borrowerId }) => {
    // TODO: Delete all files related to this borrower
  },
);

ServerEventService.addMethodListener(
  propertyDelete,
  (context, { propertyId }) => {
    // TODO: Delete all files related to this property
  },
);
