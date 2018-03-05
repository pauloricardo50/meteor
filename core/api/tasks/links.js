import { Tasks, Users, Loans, Borrowers, Properties } from '../';

Tasks.addLinks({
  assignedUser: {
    field: 'assignedTo',
    collection: Users,
    type: 'one',
  },

  loan: {
    field: 'loanId',
    collection: Loans,
    type: 'one',
  },

  property: {
    field: 'propertyId',
    collection: Properties,
    type: 'one',
  },

  borrower: {
    field: 'borrowerId',
    collection: Borrowers,
    type: 'one',
  },

  user: {
    field: 'userId',
    collection: Users,
    type: 'one',
  },
});
