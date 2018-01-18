import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import * as loanRequestMethods from './loanrequests/methods';
import * as offerMethods from './offers/methods';
import * as borrowerMethods from './borrowers/methods';
import * as comparatorMethods from './comparators/methods';
import * as propertyMethods from './properties/methods';

const methods = {
  ...loanRequestMethods,
  ...offerMethods,
  ...borrowerMethods,
  ...comparatorMethods,
  ...propertyMethods,
};

// Passed to all methods, shows a Bert error when it happens
const handleResult = (result, bertObject) => {
  if (bertObject) {
    if (bertObject.delay) {
      Bert.defaults.hideDelay = bertObject.delay;
    }

    Bert.alert({
      title: bertObject.title || "C'est réussi",
      message: bertObject.message || '<h3 class="bert">Bien joué!</h3>',
      type: bertObject.type || 'success',
      style: bertObject.style || 'growl-top-right',
    });
  }

  return result;
};

// Passed to all methods, shows a bert alert
const handleError = (error) => {
  Bert.defaults.hideDelay = 7500;
  Bert.alert({
    title: 'Misère, une erreur!',
    message: `<h3 class="bert">${error.message}</h3>`,
    type: 'danger',
    style: 'fixed-top',
  });
  console.log(error);

  // Throw the error again so that it can be catched again via promise chaining
  // All uses of this module should catch and implement proper fail-safe logic
  throw error;
};

// A wrapper method that displays an error if it occurs
const cleanMethod = (name, params, bertObject) => {
  console.log('cleanmethod!', name, params);
  if (methods[name]) {
    return methods[name]
      .callPromise(params)
      .then(result => handleResult(result, bertObject))
      .catch(handleError);
  }
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
