import { Meteor } from 'meteor/meteor';

import { SecurityService } from '../..';
import BorrowerService from '../BorrowerService';
import {
  borrowerInsert,
  borrowerUpdate,
  borrowerDelete,
} from '../methodDefinitions';

borrowerInsert.setHandler((context, { object, userId }) => {
  const userIdIsDefined = userId !== undefined;
  if (userIdIsDefined) {
    SecurityService.checkCurrentUserIsAdmin();
  } else {
    SecurityService.borrowers.isAllowedToInsert();
  }

  return BorrowerService.insert({
    object,
    userId: userIdIsDefined ? userId : Meteor.userId(),
  });
});

borrowerUpdate.setHandler((context, { borrowerId, object }) => {
  SecurityService.borrowers.isAllowedToUpdate(borrowerId);
  return BorrowerService.update({ borrowerId, object });
});

borrowerDelete.setHandler((context, { borrowerId }) => {
  SecurityService.borrowers.isAllowedToDelete(borrowerId);
  return BorrowerService.remove({ borrowerId });
});
