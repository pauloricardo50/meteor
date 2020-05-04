import { notification } from '../fragments';
import { NOTIFICATION_QUERIES } from './notificationConstants';
import Notifications from './notifications';

export const adminNotifications = Notifications.createQuery(
  NOTIFICATION_QUERIES.ADMIN_NOTIFICATIONS,
  notification(),
);
