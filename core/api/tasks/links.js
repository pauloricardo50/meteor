import { Tasks, Users, Loans, Borrowers, Properties } from '../';

Tasks.addLinks({
  assignedUser: {
    field: 'assignedTo',
    collection: Users,
    type: 'one',
  },
});

Tasks.addLinks({
  loan: {
    field: 'loanId',
    collection: Loans,
    type: 'one',
  },
});

Tasks.addLinks({
  property: {
    field: 'propertyId',
    collection: Properties,
    type: 'one',
  },
});

Tasks.addLinks({
  borrowers: {
    field: 'borrowerIds',
    collection: Borrowers,
    type: 'many',
  },
});
