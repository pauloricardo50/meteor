import SecurityService from '../../security';
import {
  generateAllNotifications,
  readNotification,
  snoozeNotification,
  unreadNotification,
} from '../methodDefinitions';
import NotificationService from './NotificationService';

readNotification.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  NotificationService.readNotification({ ...params, userId });
});

snoozeNotification.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  NotificationService.snoozeNotification({ ...params, userId });
});

unreadNotification.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  NotificationService.unreadNotification({ ...params, userId });
});

generateAllNotifications.setHandler(({ userId }) => {
  SecurityService.checkUserIsDev(userId);
  NotificationService.addTaskNotifications();
  NotificationService.addActivityNotifications();
});
