// @flow

import Loans from './loans';
import {
  Borrowers,
  Lenders,
  PromotionLots,
  PromotionOptions,
  Promotions,
  Properties,
  Revenues,
  Tasks,
  Users,
} from '..';

import LinkInitializer from '../links/LinkInitializer';

LinkInitializer.directInit(() => {
  Loans.addLinks({
    borrowers: {
      field: 'borrowerIds',
      collection: Borrowers,
      type: 'many',
    },
    promotions: {
      field: 'promotionLinks',
      collection: Promotions,
      type: 'many',
      metadata: true,
    },
    promotionOptions: {
      field: 'promotionOptionLinks',
      collection: PromotionOptions,
      type: 'many',
      unique: true,
      metadata: true,
      autoremove: true,
    },
    properties: {
      field: 'propertyIds',
      collection: Properties,
      type: 'many',
    },
    revenues: {
      field: 'revenueLinks',
      collection: Revenues,
      type: 'many',
    },
    user: {
      field: 'userId',
      collection: Users,
      type: 'one',
      denormalize: {
        field: 'userCache',
        body: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          referredByOrganisationLink: 1,
          assignedEmployeeCache: 1,
        },
      },
    },
  });
});

LinkInitializer.inversedInit(() => {
  Loans.addLinks({
    attributedPromotionLots: {
      collection: PromotionLots,
      inversedBy: 'attributedTo',
    },
    lenders: {
      collection: Lenders,
      inversedBy: 'loan',
      unique: true,
      autoremove: true,
      denormalize: {
        field: 'lendersCache',
        body: {
          status: 1,
          contactLink: 1,
          organisationLink: 1,
        },
      },
    },
    tasks: {
      collection: Tasks,
      inversedBy: 'loan',
      autoremove: true,
      denormalize: {
        field: 'tasksCache',
        body: {
          dueAt: 1,
          title: 1,
          status: 1,
        },
      },
    },
  });
});
