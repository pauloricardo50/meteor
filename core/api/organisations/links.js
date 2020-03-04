import LinkInitializer from '../links/LinkInitializer';
import {
  Contacts,
  Lenders,
  Users,
  LenderRules,
  Revenues,
  Tasks,
  Insurances,
  InsuranceProducts,
} from '..';
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
  });
});
