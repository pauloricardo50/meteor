import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { irs10yFetch } from 'core/api/irs10y/server/methods';

const getRandomMinute = () => Math.floor(Math.random() * 49) + 10;
const jobName = 'Fetch IRS 10Y';

Meteor.startup(() => {
  try {
    SyncedCron.stop();
    SyncedCron.remove(jobName);
    SyncedCron.add({
      name: jobName,
      schedule(parser) {
        const randomMinute = getRandomMinute();
        return parser.text(`at 6:${randomMinute}`);
      },
      job() {
        irs10yFetch.run({});
      },
    });
    SyncedCron.start();
  } catch (error) {
    console.error(error);
  }
});
