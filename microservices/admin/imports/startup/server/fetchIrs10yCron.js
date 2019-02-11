import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';

import moment from 'moment';

import { logError, irs10yFetch } from 'core/api/methods';

const getRandomMinute = () => Math.floor(Math.random() * 49) + 10;
const jobName = 'Fetch IRS 10Y';

SyncedCron.config({
  logger: ({ level, message, tag }) => {
    if (Meteor.isProduction) {
      console.log('---------------------- CRON LOG ----------------------');
      console.log('Level', level);
      console.log('Message', message);
      console.log('Tag', tag);
    }
  },
});

Meteor.startup(() => {
  try {
    SyncedCron.stop();
    SyncedCron.remove(jobName);
    SyncedCron.add({
      name: jobName,
      schedule(parser) {
        const randomMinute = getRandomMinute();
        const tomorrow = moment()
          .add(1, 'days')
          .format('dddd');
        return parser.text(`at 6:${randomMinute} on ${tomorrow}`);
      },
      job() {
        irs10yFetch.run({});
      },
    });
    SyncedCron.start();
  } catch (error) {
    logError.run({ error });
  }
});
