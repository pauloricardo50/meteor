import { Meteor } from 'meteor/meteor';
import { Method } from '../methods';
import ClientEventService, {
  CALLED_METHOD,
} from '../../events/ClientEventService';
import { logError } from '../../slack/methodDefinitions';
import { refetchQueries } from '../clientQueryManager';

const shouldLogErrorsToConsole = (Meteor.isDevelopment || Meteor.isStaging) && !Meteor.isTest;

const handleError = ({ config, params, result, error }) => {
  if (shouldLogErrorsToConsole) {
    console.error('Meteor Method error:', error);
  }
  logError.run({
    error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
    additionalData: ['Meteor method afterCall error', config, params],
    url:
      window && window.location && window.location.href
        ? window.location.href
        : '',
  });

  import('../../../utils/message').then(({ default: message }) => {
    message.error(error.reason || error.message, 8);
  });
};

const handleSuccess = (config, params) => {
  ClientEventService.emit(CALLED_METHOD);
  ClientEventService.emitMethod(config, params);

  // Refresh all non-reactive queries
  if (!config.noRefreshAfterCall) {
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

if (Meteor.isTest) {
  Method.isDebugEnabled = false;
} else {
  Method.isDebugEnabled = { omit: ['analyticsPage', 'analyticsLogin'] };
}
