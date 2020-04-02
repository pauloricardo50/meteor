import Activities from '../activities/index';
import Borrowers from '../borrowers/index';
import Contacts from '../contacts/index';
import InsuranceRequests from '../insuranceRequests/index';
import LinkInitializer from '../links/LinkInitializer';
import Loans from '../loans/loans';
import Offers from '../offers/index';
import Organisations from '../organisations/index';
import Promotions from '../promotions/index';
import Properties from '../properties/index';
import Sessions from '../sessions/index';
import Tasks from '../tasks/tasks';
import Users from './users';

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
    insuranceRequests: {
      collection: InsuranceRequests,
      inversedBy: 'user',
      autoremove: true,
    },
    assignedInsuranceRequests: {
      collection: InsuranceRequests,
      inversedBy: 'assignees',
    },
  });
});
