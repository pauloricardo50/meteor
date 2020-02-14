import LinkInitializer from '../links/LinkInitializer';
import Tasks from '../tasks';
import { Contacts, Organisations, Loans, Offers } from '..';
import Lenders from '.';

LinkInitializer.directInit(() => {
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
  });
});

LinkInitializer.inversedInit(() => {
  Lenders.addLinks({
    offers: {
      collection: Offers,
      inversedBy: 'lender',
      autoremove: true,
      denormalize: {
        field: 'offersCache',
        body: { _id: 1 },
      },
    },
    tasks: {
      inversedBy: 'lender',
      collection: Tasks,
      autoremove: true,
    },
  });
});
