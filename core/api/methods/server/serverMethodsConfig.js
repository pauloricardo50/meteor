import { Method } from '../methods';

import EventService from '../../events';

Method.addAfterExecution(({ context, config, params, result, error }) => {
  EventService.emitMethod(config, params);
});
