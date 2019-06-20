import Activities from './activities';
import Notifications from '../notifications/index';

Activities.addLinks({
  notifications: {
    collection: Notifications,
    inversedBy: 'activity',
    autoremove: true,
  },
});
