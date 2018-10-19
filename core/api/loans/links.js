// @flow
import Loans from './loans';
import {
  Properties,
  Borrowers,
  Users,
  Tasks,
  Offers,
  Promotions,
  PromotionOptions,
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
  },
  tasks: {
    collection: Tasks,
    inversedBy: 'loan',
  },
  offers: {
    collection: Offers,
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
    // unique: true,
    metadata: true,
    autoremove: true,
  },
});
