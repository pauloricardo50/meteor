import Notifications from './notifications';
import { NOTIFICATION_QUERIES } from './notificationConstants';
import { notification } from '../fragments';

export const adminNotifications = Notifications.createQuery(
  NOTIFICATION_QUERIES.ADMIN_NOTIFICATIONS,
  notification(),
);
