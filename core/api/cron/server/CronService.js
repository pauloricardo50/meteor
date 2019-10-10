import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';

import { logError } from 'core/api/methods';
import SlackService from 'core/api/slack/server/SlackService';
import CronitorService from './CronitorService';

class CronService {
  init() {
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
        SyncedCron.start();
      } catch (error) {
        logError.run({ error });
      }
    });
  }

  addJob(cronJob, cronitorSettings = {}) {
    const { func, name, schedule } = cronJob;
    const { id: cronitorId } = cronitorSettings;

    const withCronitor = cronitorId
      && !(Meteor.isTest || Meteor.isAppTest || Meteor.isDevelopment);

    const cronitor = new CronitorService({ id: cronitorId });

    SyncedCron.add({
      name,
      schedule,
      job: async () => {
        try {
          if (withCronitor) {
            await cronitor.run();
          }

          const jobResponse = await func();

          if (withCronitor) {
            await cronitor.complete(jobResponse);
          }
        } catch (error) {
          if (withCronitor) {
            await cronitor.fail(error);
          }

          await SlackService.sendError({
            error,
            additionalData: [`${name} CRON error`],
          });
        }
      },
    });
  }

  removeJob(jobName) {
    SyncedCron.remove(jobName);
  }
}

export default new CronService();
