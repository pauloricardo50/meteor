import { Meteor } from 'meteor/meteor';

import Activities from '../activities/index';
import Borrowers from '../borrowers/index';
import Loans from '../loans/loans';
import Offers from '../offers/index';
import Properties from '../properties/index';
import Sessions from '../sessions/index';
import Tasks from '../tasks/tasks';
import UpdateWatchers from '../updateWatchers/server/updateWatchers';
import Users from '../users/users';

Meteor.startup(() => {
  Activities._ensureIndex({ 'loanLink._id': 1 });
  Activities._ensureIndex({ 'userLink._id': 1 });
  Borrowers._ensureIndex({ userId: 1 });
  Loans._ensureIndex({ userId: 1 });
  Loans._ensureIndex({ propertyIds: 1 });
  Offers._ensureIndex({ loanId: 1 });
  Properties._ensureIndex({ userId: 1 });
  Sessions._ensureIndex({ connectionId: 1 });
  Tasks._ensureIndex({ docId: 1 });
  UpdateWatchers._ensureIndex({ docId: 1, collection: 1 });
  UpdateWatchers._ensureIndex({ updatedAt: -1 });
  Users._ensureIndex({ referredByUserLink: 1 });
});
