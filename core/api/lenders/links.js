import Lenders from '.';
import { Contacts, Organisations, Loans } from '..';

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
    collection: Loans,
    inversedBy: 'lenders',
  },
});
