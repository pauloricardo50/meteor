import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';

import SlackService from '../../slack/server/SlackService';
import FileService from './FileService';

import CronitorService from '../../cronitor/server/CronitorService';

const cronitor = new CronitorService({ id: 'RntC9I' });

SyncedCron.add({
  name: 'Flush temp files',
  schedule(parser) {
    return parser.text('every 1 minute');
  },
  job: async () => {
    try {
      const count = await FileService.flushTempFiles();
      if (!Meteor.isTest && !Meteor.isAppTest && !Meteor.isDevelopment) {
        cronitor.complete(`Deleted ${count} temp files`);
      }
    } catch (error) {
      if (!Meteor.isTest && !Meteor.isAppTest && !Meteor.isDevelopment) {
        cronitor.fail(error);
      }
      SlackService.sendError({
        error,
        additionalData: ['Flush temp files CRON error'],
      });
    }
  },
});
