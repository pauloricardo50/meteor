import CommissionRates from '../commissionRates';
import Contacts from '../contacts';
import InsuranceProducts from '../insuranceProducts';
import Insurances from '../insurances';
import LenderRules from '../lenderRules';
import Lenders from '../lenders';
import LinkInitializer from '../links/LinkInitializer';
import Revenues from '../revenues';
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
