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

  console.error('Meteor method error:', error);
};

Method.addAfterCall(({ context, config, params, result, error }) => {
  if (error) {
    handleError(error);
  }
  console.log(`Hello from Method ${config.name} on the client`);
  // Do something on the client
});
