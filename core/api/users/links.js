import Users from './users';
import {
  Loans,
  Offers,
  Borrowers,
  Properties,
  Promotions,
  Contacts,
  Organisations,
} from '..';

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
    autoremove: true,
  },
  contact: {
    collection: Contacts,
    inversedBy: 'user',
  },
  loans: {
    collection: Loans,
    inversedBy: 'user',
    autoremove: true,
  },
  promotions: {
    collection: Promotions,
    inversedBy: 'users',
  },
  properties: {
    collection: Properties,
    inversedBy: 'user',
    autoremove: true,
  },
  offers: {
    collection: Offers,
    inversedBy: 'user',
  },
  organisations: {
    collection: Organisations,
    inversedBy: 'users',
  },
  proProperties: {
    collection: Properties,
    inversedBy: 'users',
  },
  referredByUser: {
    collection: Users,
    field: 'referredByUserLink',
    type: 'one',
  },
  referredCustomers: {
    collection: Users,
    inversedBy: 'referredByUser',
    type: 'many',
  },
  referredByOrganisation: {
    collection: Organisations,
    field: 'referredByOrganisationLink',
    type: 'one',
  },
});
