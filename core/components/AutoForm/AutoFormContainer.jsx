import { Meteor } from 'meteor/meteor';
import { withProps } from 'recompose';

const createParams = ({ id, ...rest }, idKey) => ({ [idKey]: id, ...rest });

const ArrayInputContainer = withProps(({ collection }) => {
  let popFunc;
  let pushFunc;
  let updateFunc;
  let idKey;

  switch (collection) {
  case 'loans':
    updateFunc = 'loanUpdate';
    popFunc = 'popLoanValue';
    pushFunc = 'pushLoanValue';
    idKey = 'loanId';
    break;
  case 'borrowers':
    updateFunc = 'borrowerUpdate';
    popFunc = 'popBorrowerValue';
    pushFunc = 'pushBorrowerValue';
    idKey = 'borrowerId';

    break;
  case 'properties':
    updateFunc = 'propertyUpdate';
    popFunc = 'popPropertyValue';
    pushFunc = 'pushPropertyValue';
    idKey = 'propertyId';
    break;

  default:
    break;
  }

  return {
    updateFunc: rawParams =>
      new Promise((resolve, reject) => {
        const params = createParams(rawParams, idKey);
        Meteor.call(updateFunc, params, (error, result) => {
          if (error) {
            reject(error);
          }

          resolve(result);
        });
      }),
    popFunc: rawParams =>
      new Promise((resolve, reject) => {
        const params = createParams(rawParams, idKey);
        Meteor.call(popFunc, params, (error, result) => {
          if (error) {
            reject(error);
          }

          resolve(result);
        });
      }),
    pushFunc: rawParams =>
      new Promise((resolve, reject) => {
        const params = createParams(rawParams, idKey);
        Meteor.call(pushFunc, params, (error, result) => {
          if (error) {
            reject(error);
          }

          resolve(result);
        });
      }),
  };
});

export default ArrayInputContainer;
