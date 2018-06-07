import { Meteor } from 'meteor/meteor';
import { Method } from '../methods';

import { ServerEventService } from '../../events';

Method.addAfterExecution(({ context, config, params, result, error }) => {
  if (!error) {
    ServerEventService.emitMethod(config, params);
  }
});

if (Meteor.isTest) {
  Method.isDebugEnabled = false;
}
