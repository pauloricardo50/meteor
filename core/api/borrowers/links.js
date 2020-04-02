import InsuranceRequests from '../insuranceRequests';
import Insurances from '../insurances';
import LinkInitializer from '../links/LinkInitializer';
import Loans from '../loans';
import MortgageNotes from '../mortgageNotes';
import Users from '../users';
import Borrowers from './borrowers';

LinkInitializer.directInit(() => {
  Borrowers.addLinks({
    user: {
      field: 'userId',
      collection: Users,
      type: 'one',
    },
    mortgageNotes: {
      field: 'mortgageNoteLinks',
      collection: MortgageNotes,
      type: 'many',
      metadata: true,
      autoremove: true,
      unique: true,
    },
  });
});

LinkInitializer.inversedInit(() => {
  Borrowers.addLinks({
    loans: {
      collection: Loans,
      inversedBy: 'borrowers',
    },
    insuranceRequests: {
      collection: InsuranceRequests,
      inversedBy: 'borrowers',
    },
    insurances: {
      collection: Insurances,
      inversedBy: 'borrower',
    },
  });
});
