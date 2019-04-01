import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';

import moment from 'moment';

import { logError } from 'core/api/methods';
import { irs10yFetch } from 'core/api/irs10y/server/methods';
import CronitorService from 'core/api/cronitor/server/CronitorService';
import SlackService from 'core/api/slack/server/SlackService';

const getRandomMinute = () => Math.floor(Math.random() * 49) + 10;
const jobName = 'Fetch IRS 10Y';

const cronitor = new CronitorService({ id: '19MCrQ' });

// Make this a function so that randomMinute is always different
const job = () => ({
  name: jobName,
  schedule(parser) {
    const randomMinute = getRandomMinute();
    const tomorrow = moment()
      .add(1, 'days')
      .format('dddd');
    const parserText = `at 6:${randomMinute} on ${tomorrow}`;
    const parsedText = parser.text(parserText);

    return parsedText;
  },
  job() {
    try {
      cronitor
        .run()
        .then(() => irs10yFetch.run({}))
        .then(cronitor.complete)
        .then(() => {
          SyncedCron.remove(jobName);
          SyncedCron.add(job());
        })
        .catch((error) => {
          if (error.message && error.message.includes('existe déjà')) {
            return cronitor.complete(error.message);
          }
          return cronitor.fail(error);
        });
    } catch (error) {
      SlackService.sendError({
        error,
        additionalData: ['IRS 10Y CRON error'],
      });
    }
  },
});

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

SyncedCron.add(job());

Meteor.startup(() => {
  try {
    SyncedCron.start();
  } catch (error) {
    logError.run({ error });
  }
});
