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
  promotion: {
    field: 'promotionLink',
    collection: Users,
    type: 'one',
    metadata: true,
  },
  organisation: {
    field: 'organisationLink',
    collection: Users,
    type: 'one',
    metadata: true,
  },
  lender: {
    field: 'lenderLink',
    collection: Users,
    type: 'one',
    metadata: true,
  },
});
