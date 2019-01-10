import { Meteor } from 'meteor/meteor';
import { Method } from '../methods';
import ClientEventService, {
  CALLED_METHOD,
} from '../../events/ClientEventService';
import message from '../../../utils/message';
import { logError } from '../../slack/methodDefinitions';

const shouldLogErrorsToConsole = (Meteor.isDevelopment || Meteor.isStaging) && !Meteor.isTest;

const handleError = (error) => {
  if (shouldLogErrorsToConsole) {
    console.error('Meteor Method error:', error);
  }
  logError.run({
    error: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
    additionalData: ['Meteor method afterCall error'],
    url: window && window.location && window.location.href,
  });

  message.error(error.reason || error.message, 8);
};

const handleSuccess = (config, params) => {
  ClientEventService.emit(CALLED_METHOD);
  ClientEventService.emitMethod(config, params);

  // Refresh all non-reactive queries
  if (!config.noRefreshAfterCall && window) {
    (window.activeQueries || []).forEach((query) => {
      ClientEventService.emit(query);
    });
  }
};

Method.addAfterCall(({ config, params, result, error }) => {
  if (error) {
    handleError(error);
  } else {
    handleSuccess(config, params);
  }
});

if (Meteor.isTest) {
  Method.isDebugEnabled = false;
}
