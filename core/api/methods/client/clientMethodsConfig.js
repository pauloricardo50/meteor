import { Meteor } from 'meteor/meteor';

import { logError } from '../../errorLogger/methodDefinitions';
import ClientEventService, {
  CALLED_METHOD,
} from '../../events/ClientEventService';
import { refetchQueries } from '../clientQueryManager';
import { Method } from '../methods';

const shouldLogErrorsToConsole =
  (Meteor.isDevelopment || Meteor.isStaging || Meteor.isDevEnvironment) &&
  !Meteor.isTest;

const handleError = ({ config, params, result, error }) => {
  if (shouldLogErrorsToConsole) {
    console.error('Meteor Method error:', error);
  }
  logError.run({
    error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
    additionalData: [
      'Meteor method afterCall error',
      config,
      JSON.stringify(params, null, 2),
    ],
    url:
      window && window.location && window.location.href
        ? window.location.href
        : '',
  });

  if (config.hideClientError) {
    return;
  }

  import('../../../utils/message').then(({ default: message }) => {
    message.error(error.reason || error.message, 8);
  });
};

const handleSuccess = (config, params) => {
  ClientEventService.emit(CALLED_METHOD);
  ClientEventService.emitAfterMethod(config, params);

  // Refresh all non-reactive queries
  // As long as they don't specify to not refetch
  // and as long as the method called is supposed to refetch them
  // for example: all tracking/analytics methods should not trigger
  // query refetches
  if (!config.noRefreshAfterCall && !config.doNotRefetchQueries) {
    refetchQueries(config.name);
  }
};

Method.addAfterCall(({ config, params, result, error }) => {
  if (error) {
    handleError({ config, params, result, error });
  } else {
    handleSuccess(config, params);
  }
});
