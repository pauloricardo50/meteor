import Activities from '../activities';
import Revenues from '../revenues';
import Tasks from '../tasks';
import Users from '../users';
import Notifications from './notifications';

Notifications.addLinks({
  recipients: {
    collection: Users,
    field: 'recipientLinks',
    type: 'many',
    metadata: true,
  },
  activity: {
    collection: Activities,
    field: 'activityLink',
    type: 'one',
    metadata: true,
  },
  task: {
    collection: Tasks,
    field: 'taskLink',
    type: 'one',
    metadata: true,
  },
  revenue: {
    collection: Revenues,
    field: 'revenueLink',
    type: 'one',
    metadata: true,
  },
});
