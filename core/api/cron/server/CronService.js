import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';

import { logError } from '../../errorLogger/methodDefinitions';
import ErrorLogger from '../../errorLogger/server/ErrorLogger';
import CronitorService from './CronitorService';

const ACTIVATE_CRONITOR = !(
  Meteor.isTest ||
  Meteor.isAppTest ||
  Meteor.isDevelopment ||
  Meteor.isStaging
);

export const TestCronitor = {
  run: () => null,
  complete: () => null,
  fail: () => null,
};

class CronService {
  init() {
    SyncedCron.config({
      logger: () => {},
    });

    Meteor.startup(() => {
      try {
        SyncedCron.start();
      } catch (error) {
        logError.run({ error });
      }
    });
  }

  addCron({ func, name, frequency }, { cronitorId } = {}) {
    const withCronitor = cronitorId && ACTIVATE_CRONITOR;

    let cronitor = TestCronitor;
    if (withCronitor) {
      cronitor = new CronitorService({ id: cronitorId, name });
    }

    SyncedCron.add({
      name,
      schedule(parser) {
        return parser.text(frequency);
      },
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
            await cronitor.fail(error.message);
          }

          await ErrorLogger.handleError({
            error,
            additionalData: [`${name} CRON error`],
          });
        }
      },
    });
  }

  removeCron(jobName) {
    SyncedCron.remove(jobName);
  }
}

export default new CronService();
