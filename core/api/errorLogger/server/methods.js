import { logError } from '../methodDefinitions';
import ErrorLogger from './ErrorLogger';

logError.setHandler((context, params) => {
  context.unblock();
  ErrorLogger.handleError({ ...params, connection: context.connection });
});
