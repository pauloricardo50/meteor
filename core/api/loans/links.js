// @flow

import Loans from './loans';
import {
  Properties,
  Borrowers,
  Users,
  Tasks,
  Promotions,
  PromotionOptions,
  Lenders,
  Revenues,
  PromotionLots,
} from '..';

Loans.addLinks({
  properties: {
    field: 'propertyIds',
    collection: Properties,
    type: 'many',
  },
  borrowers: {
    field: 'borrowerIds',
    collection: Borrowers,
    type: 'many',
  },
  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
    denormalize: {
      field: 'userCache',
      body: {
        referredByOrganisationLink: 1,
        assignedEmployeeCache: 1,
      },
    },
  },
  tasks: {
    collection: Tasks,
    inversedBy: 'loan',
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
  revenues: {
    field: 'revenueLinks',
    collection: Revenues,
    type: 'many',
  },
  attributedPromotionLots: {
    collection: PromotionLots,
    inversedBy: 'attributedTo',
  },
});
