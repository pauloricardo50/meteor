import Notifications from '../notifications';
import Loans from '../loans';
import Activities from './activities';
import Users from '../users';

Activities.addLinks({
  notifications: {
    collection: Notifications,
    inversedBy: 'activity',
    autoremove: true,
  },
  loan: {
    collection: Loans,
    field: 'loanLink',
    metadata: true,
  },
  user: {
    collection: Users,
    field: 'userLink',
    metadata: true,
  },
});
