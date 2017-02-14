import { updateValues } from './methods';
import { Bert } from 'meteor/themeteorchef:bert';


// The callback passed to all methods, shows a Bert error when it happens
const methodCallback = (error, result, callback) => {
  if (typeof callback === 'function') {
    callback(error, result);
    return;
  }

  if (error) {
    Bert.defaults.hideDelay = 10000;
    Bert.alert({
      title: 'Tonnerre de Brest, une erreur!',
      message: `<h4>${error.message}</h4>`,
      type: 'danger',
      style: 'fixed-top',
    });
  }
};


export const updateValuesClean = (id, object, callback) => {
  updateValues.call(
    { object, id },
    (e, r) => methodCallback(e, r, callback),
  );
};
