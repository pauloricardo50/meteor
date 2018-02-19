import { AdminActions, Loans, Users } from '../';

AdminActions.addLinks({
  staffLink: {
    field: 'staffId',
    collection: Users,
    type: 'one',
  },
  loanLink: {
    field: 'loanId',
    collection: Loans,
    type: 'one',
  },
});
