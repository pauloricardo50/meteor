import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import {
  insertRequest,
  updateRequest,
  startAuction,
  pushRequestValue,
  popRequestValue,
  incrementStep,
  requestVerification,
} from './loanrequests/methods';
import { insertOffer, insertAdminOffer, updateOffer } from './offers/methods';
import {
  insertBorrower,
  updateBorrower,
  pushBorrowerValue,
  popBorrowerValue,
} from './borrowers/methods';
import {
  insertComparator,
  updateComparator,
  addComparatorField,
  removeComparatorField,
  toggleHiddenField,
} from './comparators/methods';
import {
  insertProperty,
  deleteProperty,
  updateProperty,
  setPropertyField,
} from './properties/methods';

const methods = {
  insertRequest,
  updateRequest,
  pushRequestValue,
  popRequestValue,
  startAuction,
  incrementStep,
  requestVerification,

  insertBorrower,
  updateBorrower,
  pushBorrowerValue,
  popBorrowerValue,

  insertOffer,
  insertAdminOffer,
  updateOffer,

  insertComparator,
  updateComparator,
  addComparatorField,
  removeComparatorField,
  toggleHiddenField,

  insertProperty,
  deleteProperty,
  updateProperty,
  setPropertyField,
};

// The callback passed to all methods, shows a Bert error when it happens
const methodCallback = (error, result, callback, bertObject) => {
  let callbackResult;
  if (typeof callback === 'function') {
    callbackResult = callback(error, result);
  }

  if (error) {
    Bert.defaults.hideDelay = 7500;
    Bert.alert({
      title: 'Misère, une erreur!',
      message: `<h3 class="bert">${error.message}</h3>`,
      type: 'danger',
      style: 'fixed-top',
    });
    console.log(error);
  } else if (bertObject) {
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

  return callbackResult || result;
};

// A wrapper method that displays an error if it occurs
const cleanMethod = (name, object, id, callback, bertObject) => {
  if (methods[name]) {
    return methods[name].call({ object, id }, (e, r) =>
      methodCallback(e, r, callback, bertObject),
    );
  }
  throw new Meteor.Error('Not a valid clean method');
};

export default cleanMethod;
