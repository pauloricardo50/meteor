import { SyncedCron } from 'meteor/littledata:synced-cron';
import UpdateWatcherService from './UpdateWatcherService';
import SlackService from '../../slack/server/SlackService';

SyncedCron.add({
  name: 'Manage update watchers',
  schedule(parser) {
    return parser.text('every 1 minute');
  },
  job() {
    try {
      UpdateWatcherService.manageUpdateWatchers({ secondsFromNow: 120 });
    } catch (error) {
      SlackService.sendError({
        error,
        additionalData: ['Manage update watchers CRON error'],
      });
    }
  },
});
