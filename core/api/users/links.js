import Users from './users';
import { Loans, Offers, Borrowers, Properties, Promotions, Contacts } from '..';

Users.addLinks({
  assignedEmployee: {
    collection: Users,
    field: 'assignedEmployeeId',
    type: 'one',
  },
  assignedEndUsers: {
    collection: Users,
    inversedBy: 'assignedEmployee',
  },
  assignedPromotions: {
    collection: Promotions,
    inversedBy: 'assignedEmployee',
  },
  borrowers: {
    collection: Borrowers,
    inversedBy: 'user',
  },
  contact: {
    collection: Contacts,
    inversedBy: 'user',
  },
  loans: {
    collection: Loans,
    inversedBy: 'user',
  },
  promotions: {
    collection: Promotions,
    inversedBy: 'users',
  },
  properties: {
    collection: Properties,
    inversedBy: 'user',
  },
  offers: {
    collection: Offers,
    inversedBy: 'user',
  },
});
