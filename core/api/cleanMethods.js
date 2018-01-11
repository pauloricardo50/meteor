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

  // Throw it again so that it can be catched again where it is called
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
