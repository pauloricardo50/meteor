import { SyncedCron } from 'meteor/littledata:synced-cron';

import SlackService from '../../slack/server/SlackService';
import LoanService from './LoanService';

SyncedCron.add({
  name: 'Expire anonymous loans',
  schedule(parser) {
    return parser.text('every day');
  },
  job() {
    try {
      const count = LoanService.expireAnonymousLoans();
      console.log(`Expired ${count} loans`);
    } catch (error) {
      SlackService.sendError({
        error,
        additionalData: ['Expire anonymous loans CRON error'],
      });
    }
  },
});
