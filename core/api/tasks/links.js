import Tasks from './tasks';
import { Users, Loans } from '..';

Tasks.addLinks({
  assignee: {
    field: 'assigneeLink',
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
  user: {
    field: 'userLink',
    collection: Users,
    type: 'one',
    metadata: true,
  },
});
