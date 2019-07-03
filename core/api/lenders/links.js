import Lenders from '.';
import { Contacts, Organisations, Loans, Offers } from '..';
import Tasks from '../tasks';

Lenders.addLinks({
  contact: {
    field: 'contactLink',
    collection: Contacts,
    type: 'one',
    metadata: true,
  },
  organisation: {
    field: 'organisationLink',
    collection: Organisations,
    type: 'one',
    metadata: true,
  },
  loan: {
    field: 'loanLink',
    collection: Loans,
    type: 'one',
    metadata: true,
  },
  offers: {
    collection: Offers,
    inversedBy: 'lender',
    autoremove: true,
  },
  tasks: {
    inversedBy: 'lender',
    collection: Tasks,
    autoremove: true,
  },
});
