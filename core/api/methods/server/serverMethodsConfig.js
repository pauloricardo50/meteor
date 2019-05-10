import { Meteor } from 'meteor/meteor';
import { Method } from '../methods';
import SlackService from '../../slack/server/SlackService';

import ServerEventService from '../../events/server/ServerEventService';

const logMethod = ({ context, config, params, result, error }) => {
  if (Meteor.isProduction || Meteor.isStaging) {
    console.log('---------------------- METHOD CALL ----------------------');
    console.log(`METHOD Method ${config.name} called`);
    console.log('METHOD Params:', params);
    console.log('METHOD userId:', context.userId);
    console.log('METHOD result:', result);
    console.log('METHOD error:', error);
  }
};

Method.addAfterExecution(({ context, config, params, result, error }) => {
  logMethod({ context, config, params, result, error });

  if (error) {
    SlackService.sendError({
      error,
      additionalData: [
        `Server method error in method: "${config.name}"`,
        { name: 'context', data: context },
        { name: 'params', data: params },
      ],
      userId: context.userId,
    });
  }

  if (!error) {
    ServerEventService.emitMethod(config, { context, config, params, result, error });
  }
});
