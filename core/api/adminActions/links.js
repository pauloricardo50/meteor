import { AdminActions, Loans, Users } from '../';

AdminActions.addLinks({
  staff: {
    field: 'staffId',
    collection: Users,
    type: 'one',
  },
  loan: {
    field: 'loanId',
    collection: Loans,
    type: 'one',
  },
});
