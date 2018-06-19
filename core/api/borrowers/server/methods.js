import { SecurityService } from '../..';
import BorrowerService from '../BorrowerService';
import {
  borrowerInsert,
  borrowerUpdate,
  borrowerDelete,
  pushBorrowerValue,
  popBorrowerValue,
} from '../methodDefinitions';
import { checkInsertUserId } from '../../helpers/server/methodServerHelpers';

borrowerInsert.setHandler((context, { borrower, userId }) => {
  userId = checkInsertUserId(userId);
  return BorrowerService.smartInsert({ borrower, userId });
});

borrowerUpdate.setHandler((context, { borrowerId, object }) => {
  SecurityService.borrowers.isAllowedToUpdate(borrowerId);
  return BorrowerService.update({ borrowerId, object });
});

borrowerDelete.setHandler((context, { borrowerId }) => {
  SecurityService.borrowers.isAllowedToDelete(borrowerId);
  return BorrowerService.remove({ borrowerId });
});

pushBorrowerValue.setHandler((context, { borrowerId, object }) => {
  SecurityService.borrowers.isAllowedToUpdate(borrowerId);
  return BorrowerService.pushValue(object);
});

popBorrowerValue.setHandler((context, { borrowerId, object }) => {
  SecurityService.borrowers.isAllowedToUpdate(borrowerId);
  return BorrowerService.pushValue(object);
});
