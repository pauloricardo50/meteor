import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import {
  insertRequest,
  updateValues,
  startAuction,
  pushValue,
  popValue,
} from './loanrequests/methods';
import { insertOffer, updateOffer } from './offers/methods';

const methods = {
  insert: insertRequest,
  update: updateValues,
  startAuction,
  push: pushValue,
  pop: popValue,
  insertOffer,
  updateOffer,
};

// The callback passed to all methods, shows a Bert error when it happens
const methodCallback = (error, result, callback, showSuccess) => {
  if (typeof callback === 'function') {
    callback(error, result);
  }

  if (error) {
    Bert.defaults.hideDelay = 7500;
    Bert.alert({
      title: 'Misère, une erreur!',
      message: `<h3 class="bert">${error.message}</h3>`,
      type: 'danger',
      style: 'fixed-top',
    });
  } else if (showSuccess) {
    Bert.alert({
      title: 'Action réussie',
      message: '<h3 class="bert">Bien joué!</h3>',
      type: 'success',
      style: 'fixed-top',
    });
  }
};

// A wrapper method that displays an error if it occurs
const cleanMethod = (name, id, object, callback, showSuccess) => {
  if (methods[name]) {
    methods[name].call({ object, id }, (e, r) =>
      methodCallback(e, r, callback, showSuccess));
  } else {
    throw new Meteor.Error('Not a valid clean method');
  }
};

export default cleanMethod;
