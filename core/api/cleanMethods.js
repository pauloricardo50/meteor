import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

// Passed to all methods, shows a Bert error when it happens
const handleResult = (result, bertObject) => {
  if (Meteor.isClient && !!bertObject) {
    const { delay, title, message, type, style } = bertObject;
    if (delay) {
      Bert.defaults.hideDelay = delay;
    }

    Bert.alert({
      title: title || "C'est réussi",
      message:
        message === undefined ? '<h3 class="bert">Bien joué!</h3>' : message,
      type: type || 'success',
      style: style || 'growl-top-right',
    });
  }

  return result;
};

// Passed to all methods, shows a bert alert
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

  console.log(error);

  // Throw the error again so that it can be catched again via promise chaining
  // All uses of this module should catch and implement proper fail-safe logic
  throw error;
};

// A wrapper method that displays an error if it occurs
const cleanMethod = (name, params, bertObject) => {
  console.log('cleanmethod!', name, params);

  return new Promise((resolve, reject) => {
    Meteor.call(name, params, (error, result) => {
      if (error) {
        reject(handleError(error));
      } else {
        resolve(handleResult(result, bertObject));
      }
    });
  });
};

export default cleanMethod;
