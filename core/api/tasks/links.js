import Tasks from './tasks';
import { Users, Loans } from '..';
import Notifications from '../notifications';
import Promotions from '../promotions';
import Organisations from '../organisations';
import Lenders from '../lenders';

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
    collection: Promotions,
    type: 'one',
    metadata: true,
  },
  organisation: {
    field: 'organisationLink',
    collection: Organisations,
    type: 'one',
    metadata: true,
  },
  lender: {
    field: 'lenderLink',
    collection: Lenders,
    type: 'one',
    metadata: true,
  },
  notifications: {
    collection: Notifications,
    inversedBy: 'task',
    autoremove: true,
  },
});
