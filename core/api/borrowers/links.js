import Borrowers from './borrowers';
import { Loans, Users, MortgageNotes, InsuranceRequests, Insurances } from '..';
import LinkInitializer from '../links/LinkInitializer';

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
