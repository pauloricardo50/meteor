import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Method } from '../methods';
import ClientEventService from '../../events/client/ClientEventService';

const handleError = (error) => {
  if (Meteor.isClient) {
    Bert.defaults.hideDelay = 7500;
    Bert.alert({
      title: 'Misère, une erreur!',
      message: `<h3 class="bert">${error.message}</h3>`,
      type: 'danger',
      style: 'fixed-top',
    });
  }
  if ((Meteor.isDevelopment || Meteor.isStaging) && !Meteor.isTest) {
    console.error('Meteor Method error:', error);
  }
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
