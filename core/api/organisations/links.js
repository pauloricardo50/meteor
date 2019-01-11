import Organisations from './organisations';
import { Contacts, Lenders } from '..';

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
});
