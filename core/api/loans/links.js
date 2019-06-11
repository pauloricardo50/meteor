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

Loans.addLinks({
  attributedPromotionLots: {
    collection: PromotionLots,
    inversedBy: 'attributedTo',
  },
  borrowers: {
    field: 'borrowerIds',
    collection: Borrowers,
    type: 'many',
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
  tasks: {
    collection: Tasks,
    inversedBy: 'loan',
    type: 'many',
    autoremove: true,
  },
  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
    denormalize: {
      field: 'userCache',
      body: {
        firstName: 1,
        lastName: 1,
        referredByOrganisationLink: 1,
        assignedEmployeeCache: 1,
      },
    },
  },
});
