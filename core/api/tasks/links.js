import Tasks from './tasks';
import { Users, Loans, Borrowers, Properties } from '..';

Tasks.addLinks({
  assignedEmployee: {
    field: 'assignedEmployeeId',
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
});
