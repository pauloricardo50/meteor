import { Meteor } from 'meteor/meteor';
import { migrate } from 'meteor/herteby:denormalize';

import { Organisations, LenderRules } from '..';

Organisations.cacheCount({
  collection: LenderRules,
  referenceField: 'organisationLink._id',
  cacheField: 'lenderRulesCount',
});

Meteor.startup(() => {
  migrate('users', 'assignedEmployeeCache', {
    $or: [
      { 'assignedEmployeeCache.lastName': { $exists: false } },
      { 'assignedEmployeeCache.firstName': { $exists: false } },
    ],
  });
  migrate('loans', 'userCache', {
    'userCache.assignedEmployeeCache.firstName': { $exists: false },
  });
  migrate('loans', 'lendersCache', { lendersCache: { $exists: false } });

  // migrate('offers', 'lenderCache', { lenderCache: { $exists: false } });
  // migrate('lenderRules', 'organisationCache', {
  //   organisationCache: { $exists: false },
  // });
  // migrate('organisations', 'lenderRulesCount', {
  //   lenderRulesCount: { $exists: false },
  // });
});
