import Organisations from './organisations';
import { Contacts, Lenders, Users, LenderRules, Revenues } from '..';

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
});
