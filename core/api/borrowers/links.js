import Borrowers from './borrowers';
import { Loans, Users } from '../';

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
