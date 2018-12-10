import { SyncedCron } from 'meteor/littledata:synced-cron';
import { irs10yFetch } from 'core/api/irs10y/server/methods';

const getRandomMinute = () => Math.floor(Math.random() * 59);
const jobName = 'Fetch IRS 10Y';

try {
  SyncedCron.stop();
  SyncedCron.remove(jobName);
  SyncedCron.add({
    name: jobName,
    schedule(parser) {
      return parser.text(`at 6:${getRandomMinute()}`);
    },
    job() {
      irs10yFetch.run({});
    },
  });
  SyncedCron.start();
} catch (error) {
  console.error(error);
}
