import { Meteor } from 'meteor/meteor';
import { migrate } from 'meteor/herteby:denormalize';

import {
  Organisations,
  LenderRules,
  Properties,
  Loans,
  Users,
  Revenues,
  Lenders,
  Offers,
} from '..';

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

Organisations.cacheCount({
  collection: Revenues,
  referenceField: 'sourceOrganisationLink._id',
  cacheField: 'revenuesCount',
});

Properties.cacheCount({
  collection: Loans,
  referenceField: 'propertyIds',
  cacheField: 'loanCount',
});

Loans.cacheField({
  cacheField: 'structureCache',
  fields: ['structures', 'selectedStructure'],
  transform({ structures = [], selectedStructure }) {
    return selectedStructure
      ? structures.find(({ id }) => id === selectedStructure)
      : undefined;
  },
});

Lenders.cache({
  collection: Offers,
  type: 'many-inverse',
  fields: ['_id'],
  referenceField: 'lenderLink._id',
  cacheField: 'offersCache',
});

// Let's you easily query the main organisation of a user
Organisations.cacheField({
  fields: ['userLinks'],
  cacheField: 'mainUserLinks',
  transform: ({ userLinks = [] }) => userLinks.filter(({ isMain }) => isMain),
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
  // migrate('organisations', 'referredUsersCount', {
  //   referredUsersCount: { $exists: false },
  // });
  // migrate('organisations', 'revenuesCount', {
  //   revenuesCount: { $exists: false },
  // });
  // migrate('loans', 'structureCache', {
  //   structureCache: { $exists: false },
  //   selectedStructure: { $exists: true },
  //   $nor: [{ structures: { $exists: false } }, { structures: { $size: 0 } }],
  // });
  // migrate('lenders', 'offersCache', { offersCache: { $exists: false } });
  // migrate('loans', 'lendersCache', {
  //   $nor: [
  //     { lendersCache: { $exists: false } },
  //     { lendersCache: { $size: 0 } },
  //   ],
  //   'lendersCache.offersCache': { $exists: false },
  // });
  migrate('organisations', 'mainUserLinks', {
    mainUserLinks: { $exists: false },
  });
});
