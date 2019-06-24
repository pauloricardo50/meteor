import Notifications from '../notifications';
import Loans from '../loans';
import Activities from './activities';

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
});
