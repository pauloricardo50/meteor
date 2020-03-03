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
  Sessions,
  Insurances,
} from '..';
import LinkInitializer from '../links/LinkInitializer';

const assignedEmployeeCache = {
  _id: 1,
  firstName: 1,
  lastName: 1,
};

LinkInitializer.directInit(() => {
  Users.addLinks({
    assignedEmployee: {
      collection: Users,
      field: 'assignedEmployeeId',
      type: 'one',
      denormalize: {
        field: 'assignedEmployeeCache',
        body: assignedEmployeeCache,
      },
    },
    borrowers: {
      collection: Borrowers,
      inversedBy: 'user',
      autoremove: true,
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
});

LinkInitializer.inversedInit(() => {
  Users.addLinks({
    activities: {
      inversedBy: 'user',
      collection: Activities,
      autoremove: true,
    },
    assignedEndUsers: {
      collection: Users,
      inversedBy: 'assignedEmployee',
    },
    assignedLoans: {
      collection: Loans,
      inversedBy: 'assignees',
    },
    assignedPromotions: {
      collection: Promotions,
      inversedBy: 'assignedEmployee',
    },
    assignedTasks: {
      collection: Tasks,
      inversedBy: 'assignee',
    },
    contact: {
      collection: Contacts,
      inversedBy: 'user',
    },
    impersonatingSession: {
      collection: Sessions,
      inversedBy: 'impersonatingAdmin',
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
    tasks: {
      collection: Tasks,
      inversedBy: 'user',
      autoremove: true,
    },
    insurances: {
      collection: Insurances,
      inversedBy: 'user',
      autoremove: true,
    },
    assignedInsurances: {
      collection: Insurances,
      inversedBy: 'assignees',
    },
  });
});
