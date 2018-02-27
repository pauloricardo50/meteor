import { Meteor } from 'meteor/meteor';

import { SecurityService, createMutator } from '../..';
import BorrowerService from '../BorrowerService';
import * as defs from '../mutationDefinitions';

createMutator(defs.BORROWER_INSERT, ({ object, userId }) => {
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

createMutator(defs.BORROWER_UPDATE, ({ borrowerId, object }) => {
  SecurityService.borrowers.isAllowedToUpdate(borrowerId);
  return BorrowerService.update({ borrowerId, object });
});

createMutator(defs.BORROWER_DELETE, ({ borrowerId }) => {
  SecurityService.borrowers.isAllowedToDelete(borrowerId);
  return BorrowerService.remove({ borrowerId });
});
