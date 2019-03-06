import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';

import moment from 'moment';

import { logError } from 'core/api/methods';
import { irs10yFetch } from 'core/api/irs10y/server/methods';
import CronitorService from 'core/api/cronitor/server/CronitorService';

const getRandomMinute = () => Math.floor(Math.random() * 49) + 10;
const jobName = 'Fetch IRS 10Y';

const cronitor = new CronitorService({ id: '19MCrQ' });

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
        const parserText = `at 6:${randomMinute} on ${tomorrow}`;
        const parsedText = parser.text(parserText);
        console.log('CRON_DEBUG');
        console.log(parserText);
        console.log(parsedText);

        return parsedText;
      },
      job() {
        cronitor
          .run()
          .then(() => irs10yFetch.run({}))
          .then(cronitor.complete)
          .catch(cronitor.fail);
      },
    });
    SyncedCron.start();
  } catch (error) {
    logError.run({ error });
  }
});
