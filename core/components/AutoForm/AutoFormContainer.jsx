import { Meteor } from 'meteor/meteor';
import { withProps } from 'recompose';

import {
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  MORTGAGE_NOTES_COLLECTION,
} from '../../api/constants';

const createParams = ({ id, ...rest }, idKey) => ({ [idKey]: id, ...rest });

const AutoFormContainer = withProps(({ collection, beforeUpdate }) => {
  let popFunc;
  let pushFunc;
  let updateFunc;
  let idKey;

  switch (collection) {
  case LOANS_COLLECTION:
    updateFunc = 'loanUpdate';
    popFunc = 'popLoanValue';
    pushFunc = 'pushLoanValue';
    idKey = 'loanId';
    break;
  case BORROWERS_COLLECTION:
    updateFunc = 'borrowerUpdate';
    popFunc = 'popBorrowerValue';
    pushFunc = 'pushBorrowerValue';
    idKey = 'borrowerId';

    break;
  case PROPERTIES_COLLECTION:
    updateFunc = 'propertyUpdate';
    popFunc = 'popPropertyValue';
    pushFunc = 'pushPropertyValue';
    idKey = 'propertyId';
    break;
  case MORTGAGE_NOTES_COLLECTION:
    updateFunc = 'mortgageNoteUpdate';
    idKey = 'mortgageNoteId';
    break;

  default:
    throw new Error(`Invalid collection in AutoForm: ${collection}`);
  }

  return {
    updateFunc: rawParams =>
      new Promise((resolve, reject) => {
        const params = createParams(rawParams, idKey);
        if (beforeUpdate) {
          beforeUpdate(params);
        }

        Meteor.call(updateFunc, params, (error, result) => {
          if (error) {
            reject(error);
          }

          resolve(result);
        });
      }),
    popFunc: rawParams => new Promise((resolve, reject) => {
      const params = createParams(rawParams, idKey);
      if (beforeUpdate) {
        beforeUpdate(params);
      }

      Meteor.call(popFunc, params, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    }),
    pushFunc: rawParams => new Promise((resolve, reject) => {
      const params = createParams(rawParams, idKey);
      if (beforeUpdate) {
        beforeUpdate(params);
      }

      Meteor.call(pushFunc, params, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    }),
  };
});

export default AutoFormContainer;
