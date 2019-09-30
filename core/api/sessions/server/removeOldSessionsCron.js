import { SyncedCron } from 'meteor/littledata:synced-cron';

import SlackService from '../../slack/server/SlackService';
import SessionService from './SessionService';

SyncedCron.add({
  name: 'Remove old sessions',
  schedule(parser) {
    return parser.text('every 1 minute');
  },
  job() {
    try {
      const count = SessionService.removeOldSessions();
      console.log(`Removed ${count} sessions`);
    } catch (error) {
      SlackService.sendError({
        error,
        additionalData: ['Remove old sessions CRON error'],
      });
    }
  },
});
