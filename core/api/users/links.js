import Users from './users';
import { Loans, Offers, Borrowers, Properties, Promotions, Partners } from '..';

Users.addLinks({
  loans: {
    collection: Loans,
    inversedBy: 'user',
  },
  borrowers: {
    collection: Borrowers,
    inversedBy: 'user',
  },
  properties: {
    collection: Properties,
    inversedBy: 'user',
  },
  offers: {
    collection: Offers,
    inversedBy: 'user',
  },
  assignedEmployee: {
    collection: Users,
    field: 'assignedEmployeeId',
    type: 'one',
  },
  assignedEndUsers: {
    collection: Users,
    inversedBy: 'assignedEmployee',
  },
  promotions: {
    collection: Promotions,
    inversedBy: 'users',
  },
  assignedPromotions: {
    collection: Promotions,
    inversedBy: 'assignedEmployee',
  },
  partner: {
    collection: Partners,
    inversedBy: 'user',
  },
});
