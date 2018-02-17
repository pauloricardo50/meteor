import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import { checkParams } from './createMutator';

const handleError = (error, mutationName) => {
  if (Meteor.isClient) {
    Bert.defaults.hideDelay = 7500;
    Bert.alert({
      title: 'Misère, une erreur!',
      message: `<h3 class="bert">${error.message} in ${mutationName}</h3>`,
      type: 'danger',
      style: 'fixed-top',
    });
  }

  // Throw the error again so that it can be catched again via promise chaining
  // All uses of this module should catch and implement proper fail-safe logic
  throw error;
};

const callMutation = (mutationOptions, callParams) => {
  const { name, params } = mutationOptions;
  checkParams(callParams, params);

  return new Promise((resolve, reject) => {
    Meteor.call(name, callParams, (error, result) => {
      if (error) {
        reject(handleError(error, name));
      } else {
        resolve(result);
      }
    });
  });
};

export default callMutation;
