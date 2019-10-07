import Users from './users';
import {
  Loans,
  Offers,
  Borrowers,
  Properties,
  Promotions,
  Contacts,
  Organisations,
  Tasks,
  Activities,
} from '..';

const assignedEmployeeCache = {
  _id: 1,
  firstName: 1,
  lastName: 1,
};

Users.addLinks({
  activities: {
    inversedBy: 'user',
    collection: Activities,
    autoremove: true,
  },
  assignedEmployee: {
    collection: Users,
    field: 'assignedEmployeeId',
    type: 'one',
    denormalize: {
      field: 'assignedEmployeeCache',
      body: assignedEmployeeCache,
    },
  },
  assignedEndUsers: {
    collection: Users,
    inversedBy: 'assignedEmployee',
  },
  assignedPromotions: {
    collection: Promotions,
    inversedBy: 'assignedEmployee',
  },
  assignedTasks: {
    collection: Tasks,
    inversedBy: 'assignee',
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
  tasks: {
    collection: Tasks,
    inversedBy: 'user',
    autoremove: true,
  },
});
