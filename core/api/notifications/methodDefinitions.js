import { Method } from '../methods/methods';

export const snoozeNotification = new Method({
  name: 'snoozeNotification',
  params: { notificationId: String },
});

export const readNotification = new Method({
  name: 'readNotification',
  params: { notificationId: String },
});

export const unreadNotification = new Method({
  name: 'unreadNotification',
  params: { notificationId: String },
});
