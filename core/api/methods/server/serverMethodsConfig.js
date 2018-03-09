import { Methods } from '../methods';

import EventService from '../events';

Methods.addAfterExecution(({ context, config, params, result, error }) => {
  EventService.emitMethod(config, params);
});
