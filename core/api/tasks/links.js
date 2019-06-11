import Tasks from './tasks';
import { Users, Loans } from '..';

Tasks.addLinks({
  assignedEmployee: {
    field: 'assignedEmployeeLink',
    collection: Users,
    type: 'one',
    metadata: true,
  },
  loan: {
    field: 'loanLink',
    collection: Loans,
    type: 'one',
    metadata: true,
  },
});
