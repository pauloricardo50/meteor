import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Method } from './methods';

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

Method.addAfterCall(({ context, config, params, result, error }) => {
  if (error) {
    handleError(error);
  }
  // Do something on the client
});

if (Meteor.isTest) {
  Method.isDebugEnabled = false;
}
