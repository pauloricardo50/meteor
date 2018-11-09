import { Meteor } from 'meteor/meteor';
import { Method } from '../methods';
import SlackService from '../../slack/SlackService';

import ServerEventService from '../../events/server/ServerEventService';

Method.addAfterExecution(({ context, config, params, result, error }) => {
  if (error) {
    SlackService.sendError({
      error,
      additionalData: ['Server method error'],
      userId: context.userId,
    });
  }

  if (!error) {
    ServerEventService.emitMethod(config, params);
  }
});

if (Meteor.isTest) {
  Method.isDebugEnabled = false;
}
