import Activities from '../activities';
import Borrowers from '../borrowers';
import Contacts from '../contacts';
import InsuranceRequests from '../insuranceRequests';
import LinkInitializer from '../links/LinkInitializer';
import Loans from '../loans/loans';
import Offers from '../offers';
import Organisations from '../organisations';
import Promotions from '../promotions';
import Properties from '../properties';
import Sessions from '../sessions';
import Tasks from '../tasks/tasks';
import Users from './users';

LinkInitializer.directInit(() => {
  Users.addLinks({
    assignedEmployee: {
      collection: Users,
      field: 'assignedEmployeeId',
      type: 'one',
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
