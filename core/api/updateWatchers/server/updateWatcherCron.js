import { SyncedCron } from 'meteor/littledata:synced-cron';
import UpdateWatcherService from './UpdateWatcherService';

SyncedCron.add({
  name: 'Manage update watchers',
  schedule(parser) {
    return parser.text('every 1 minute');
  },
  job() {
    UpdateWatcherService.manageUpdateWatchers({ secondsFromNow: 120 });
  },
});
