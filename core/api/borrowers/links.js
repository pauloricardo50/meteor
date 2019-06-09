import Borrowers from './borrowers';
import { Loans, Users, MortgageNotes } from '..';

Borrowers.addLinks({
  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
  loans: {
    collection: Loans,
    inversedBy: 'borrowers',
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
