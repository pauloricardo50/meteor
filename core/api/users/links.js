import { Loans, Users, Borrowers } from '../';

Users.addLinks({
  loans: {
    collection: Loans,
    inversedBy: 'user',
  },
});
