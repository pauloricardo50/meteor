import Organisations from './organisations';
import { Offers, Contacts } from '..';

Organisations.addLinks({
  offers: {
    collection: Offers,
    inversedBy: 'organisation',
  },
  contacts: {
    collection: Contacts,
    field: 'contactIds',
    type: 'many',
    metadata: true,
  },
});
