import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { irs10yFetch } from 'core/api/irs10y/server/methods';

const getRandomMinute = () => Math.floor(Math.random() * 59);

Meteor.startup(() => {
  SyncedCron.add({
    name: 'Fetch IRS 10Y',
    schedule(parser) {
      return parser.text(`at 6:${getRandomMinute()}`);
    },
    job() {
      irs10yFetch.run({});
    },
  });
  SyncedCron.start();
});
