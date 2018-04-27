import { Borrowers, Loans, Users } from '../';

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
});
