import { Offers, Loans, Users } from '../';

Offers.addLinks({
  loan: {
    field: 'loanId',
    collection: Loans,
    type: 'one',
  },
  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
});
