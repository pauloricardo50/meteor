import { SyncedCron } from 'meteor/littledata:synced-cron';

import SlackService from '../../slack/server/SlackService';
import NotificationService from './NotificationService';

SyncedCron.add({
  name: 'Generate notifications',
  schedule(parser) {
    return parser.text('every 1 minute');
  },
  job() {
    try {
      NotificationService.addTaskNotifications();
      NotificationService.addActivityNotifications();
      NotificationService.addRevenueNotifications();
    } catch (error) {
      SlackService.sendError({
        error,
        additionalData: ['Notification generation error'],
      });
    }
  },
});
