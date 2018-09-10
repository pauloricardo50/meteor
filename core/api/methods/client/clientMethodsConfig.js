import { Meteor } from 'meteor/meteor';
import { Method } from '../methods';
import ClientEventService from '../../events/ClientEventService';
import message from '../../../utils/message';

const shouldLogErrorsToConsole = (Meteor.isDevelopment || Meteor.isStaging) && !Meteor.isTest;

const handleError = (error) => {
  if (shouldLogErrorsToConsole) {
    console.error('Meteor Method error:', error);
  }

  message.error(error.message, 8);
};

Method.addAfterCall(({ config, params, result, error }) => {
  if (error) {
    handleError(error);
  } else {
    ClientEventService.emitMethod(config, params);
  }
  // Do something on the client
});

if (Meteor.isTest) {
  Method.isDebugEnabled = false;
}
