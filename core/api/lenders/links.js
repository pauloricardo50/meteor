import Lenders from '.';
import { Contacts, Organisations, Loans, Offers } from '..';

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
  },
});
