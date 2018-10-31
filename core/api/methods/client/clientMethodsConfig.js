import { Meteor } from 'meteor/meteor';
import { Method } from '../methods';
import ClientEventService, {
  CALLED_METHOD,
} from '../../events/ClientEventService';
import message from '../../../utils/message';

const shouldLogErrorsToConsole = (Meteor.isDevelopment || Meteor.isStaging) && !Meteor.isTest;

const handleError = (error) => {
  if (shouldLogErrorsToConsole) {
    console.error('Meteor Method error:', error);
  }

  message.error(error.reason || error.message, 8);
};

Method.addAfterCall(({ config, params, result, error }) => {
  if (error) {
    handleError(error);
  } else {
    ClientEventService.emit(CALLED_METHOD);
    ClientEventService.emitMethod(config, params);

    // Refresh all non-reactive queries
    if (!config.noRefreshAfterCall && window) {
      (window.activeQueries || []).forEach((query) => {
        ClientEventService.emit(query);
      });
    }
  }
  // Do something on the client
});

if (Meteor.isTest) {
  Method.isDebugEnabled = false;
}
