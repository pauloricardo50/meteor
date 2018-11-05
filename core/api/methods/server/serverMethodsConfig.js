import { Meteor } from 'meteor/meteor';
import { Method } from '../methods';
import SlackService from '../../slack/SlackService';

import ServerEventService from '../../events/server/ServerEventService';

Method.addAfterExecution(({ context, config, params, result, error }) => {
  if (error) {
    SlackService.sendError(error, 'Server method error');
  }

  if (!error) {
    ServerEventService.emitMethod(config, params);
  }
});

if (Meteor.isTest) {
  Method.isDebugEnabled = false;
}
