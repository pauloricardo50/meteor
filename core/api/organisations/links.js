import CommissionRates from '../commissionRates/index';
import Contacts from '../contacts/index';
import InsuranceProducts from '../insuranceProducts/index';
import Insurances from '../insurances/index';
import LenderRules from '../lenderRules/index';
import Lenders from '../lenders/index';
import LinkInitializer from '../links/LinkInitializer';
import Revenues from '../revenues/index';
import Tasks from '../tasks/tasks';
import Users from '../users/users';
import Organisations from './organisations';

Organisations.addLinks({
  contacts: {
    collection: Contacts,
    field: 'contactIds',
    type: 'many',
    metadata: true,
  },
  lenders: {
    collection: Lenders,
    inversedBy: 'organisation',
  },
  users: {
    collection: Users,
    field: 'userLinks',
    type: 'many',
    metadata: true,
  },
  lenderRules: {
    collection: LenderRules,
    inversedBy: 'organisation',
    autoremove: true,
  },
  referredCustomers: {
    collection: Users,
    inversedBy: 'referredByOrganisation',
    type: 'many',
  },
  revenues: {
    collection: Revenues,
    inversedBy: 'organisations',
    type: 'many',
  },
  tasks: {
    inversedBy: 'organisation',
    collection: Tasks,
    autoremove: true,
  },
});

LinkInitializer.inversedInit(() => {
  Organisations.addLinks({
    sourceOfRevenues: {
      collection: Revenues,
      inversedBy: 'organisations',
    },
    insurances: {
      collection: Insurances,
      inversedBy: 'organisation',
    },
    insuranceProducts: {
      collection: InsuranceProducts,
      inversedBy: 'organisation',
    },
    commissionRates: {
      collection: CommissionRates,
      inversedBy: 'organisation',
      type: 'many',
    },
  });
});
