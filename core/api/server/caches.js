import { Meteor } from 'meteor/meteor';
import { migrate } from 'meteor/herteby:denormalize';

import { Organisations, LenderRules, Properties, Loans, Users } from '..';

Organisations.cacheCount({
  collection: LenderRules,
  referenceField: 'organisationLink._id',
  cacheField: 'lenderRulesCount',
});

Organisations.cacheCount({
  collection: Users,
  referenceField: 'referredByOrganisationLink',
  cacheField: 'referredUsersCount',
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
  // migrate('loans', 'userCache', { 'userCache.referredByUserLink': { $exists: false } });
  // migrate('loans', 'lendersCache', { lendersCache: { $exists: false } });
  // migrate('loans', 'tasksCache', { tasksCache: { $exists: false } });
  // migrate('offers', 'lenderCache', { lenderCache: { $exists: false } });
  // migrate('lenderRules', 'organisationCache', {
  //   'organisationCache._id': { $exists: false },
  // });
  // Cache counts
  // migrate('properties', 'loanCount', { loanCount: { $exists: false } });
  // migrate('organisations', 'lenderRulesCount', {
  //   loanCount: { $exists: false },
  // });
  migrate('organisations', 'referredUsersCount', {
    referredUsersCount: { $exists: false },
  });
});
