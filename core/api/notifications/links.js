import Notifications from './notifications';
import Users from '../users';
import Activities from '../activities';
import Tasks from '../tasks';

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
});
