import { Meteor } from 'meteor/meteor';

import ServerEventService from '../../events/server/ServerEventService';
import { createMeteorAsyncFunction } from '../../helpers';
import SlackService from '../../slack/server/SlackService';
import { Method } from '../methods';

const logMethod = ({ context, config, params, result, error }) => {
  if (Meteor.isProduction || Meteor.isStaging || Meteor.isDevEnvironment) {
    console.log('---------------------- METHOD CALL ----------------------');
    console.log(`METHOD Method ${config.name} called`);
    console.log('METHOD Params:', params);
    console.log('METHOD userId:', context.userId);
    console.log('METHOD result:', result);
    console.log('METHOD error:', error);
  }
};

Method.addBeforeExecution(({ context, config, params }) => {
  ServerEventService.emitBeforeMethod(config, {
    context,
    config,
    params,
  });
});

Method.addAfterExecution(
  ({ context, config, params, result: maybePromiseResult, error }) => {
    let result = maybePromiseResult;

    if (maybePromiseResult && typeof maybePromiseResult.then === 'function') {
      const awaitResult = createMeteorAsyncFunction(() => maybePromiseResult);
      result = awaitResult();
    }

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
      ServerEventService.emitAfterMethod(config, {
        context,
        config,
        params,
        result,
        error,
      });
    }
  },
);
