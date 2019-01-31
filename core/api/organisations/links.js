import Organisations from './organisations';
import { Contacts, Lenders, LenderRules } from '..';

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
  lenderRules: {
    collection: LenderRules,
    inversedBy: 'organisation',
    autoremove: true,
  },
});
