import { Meteor } from 'meteor/meteor';
import { migrate } from 'meteor/herteby:denormalize';

import { Organisations, LenderRules, Properties, Loans } from '..';

Organisations.cacheCount({
  collection: LenderRules,
  referenceField: 'organisationLink._id',
  cacheField: 'lenderRulesCount',
});

Properties.cacheCount({
  collection: Loans,
  referenceField: 'propertyIds',
  cacheField: 'loanCount',
});

Meteor.startup(() => {
  // Caches
  // migrate('promotionLots', 'promotionCache', {
  //   promotionCache: { $exists: false },
  // });
  // migrate('revenues', 'loanCache', { loanCache: { $exists: false } });
  //
  // Old migrations
  //
  // migrate('users', 'assignedEmployeeCache', {
  //   $or: [
  //     { 'assignedEmployeeCache.lastName': { $exists: false } },
  //     { 'assignedEmployeeCache.firstName': { $exists: false } },
  //   ],
  // });
  // migrate('loans', 'userCache', { 'userCache._id': { $exists: false } });
  // migrate('loans', 'lendersCache', { lendersCache: { $exists: false } });
  // migrate('loans', 'tasksCache', { tasksCache: { $exists: false } });
  // migrate('offers', 'lenderCache', { lenderCache: { $exists: false } });
  // migrate('lenderRules', 'organisationCache', {
  //   'organisationCache._id': { $exists: false },
  // });

  // Cache counts
  // They are currently broken, so we'll update them on each restart
  if (Meteor.isProduction) {
    migrate('properties', 'loanCount', { loanCount: { $eq: 0 } });
    migrate('organisations', 'lenderRulesCount', {
      lenderRulesCount: { $eq: 0 },
    });
  }
});
