import Contacts from '../contacts/index';
import LinkInitializer from '../links/LinkInitializer';
import Loans from '../loans/loans';
import Offers from '../offers/index';
import Organisations from '../organisations/index';
import Tasks from '../tasks';
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
    },
    tasks: {
      inversedBy: 'lender',
      collection: Tasks,
      autoremove: true,
    },
  });
});
