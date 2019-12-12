import { Meteor } from 'meteor/meteor';

import {
  Activities,
  Borrowers,
  Loans,
  Offers,
  Properties,
  Sessions,
  Tasks,
  Users,
} from '..';
import UpdateWatchers from '../updateWatchers/server/updateWatchers';

Meteor.startup(() => {
  Activities._ensureIndex({ 'loanLink._id': 1 });
  Activities._ensureIndex({ 'userLink._id': 1 });
  Borrowers._ensureIndex({ userId: 1 });
  Loans._ensureIndex({ userId: 1 });
  Offers._ensureIndex({ loanId: 1 });
  Properties._ensureIndex({ userId: 1 });
  Sessions._ensureIndex({ connectionId: 1 });
  Tasks._ensureIndex({ docId: 1 });
  UpdateWatchers._ensureIndex({ docId: 1, collection: 1 });
  UpdateWatchers._ensureIndex({ updatedAt: -1 });
  Users._ensureIndex({ referredByUserLink: 1 });
});
