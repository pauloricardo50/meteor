import { Meteor } from 'meteor/meteor';

import { withProps } from 'recompose';

import { BORROWERS_COLLECTION } from '../../api/borrowers/borrowerConstants';
import { LOANS_COLLECTION } from '../../api/loans/loanConstants';
import { MORTGAGE_NOTES_COLLECTION } from '../../api/mortgageNotes/mortgageNoteConstants';
import { PROPERTIES_COLLECTION } from '../../api/properties/propertyConstants';

const createParams = ({ id, ...rest }, idKey) => ({ [idKey]: id, ...rest });

const makeFunc = ({ idKey, beforeUpdate, func, override }) => rawParams => {
  if (override) {
    return override(idKey)(rawParams);
  }
  const params = createParams(rawParams, idKey);
  if (beforeUpdate) {
    beforeUpdate(params);
  }

  return new Promise((resolve, reject) =>
    Meteor.call(func, params, (err, result) =>
      err ? reject(err) : resolve(result),
    ),
  );
};

const AutoFormContainer = withProps(({ beforeUpdate, overrides = {}, doc }) => {
  let popFunc;
  let pushFunc;
  let updateFunc;
  let idKey;

  const {
    popFunc: popFuncOverride,
    pushFunc: pushFuncOverride,
    updateFunc: updateFuncOverride,
  } = overrides;

  switch (doc._collection) {
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
      throw new Error(`Invalid collection in AutoForm: ${doc._ollection}`);
  }

  return {
    updateFunc: makeFunc({
      idKey,
      beforeUpdate,
      func: updateFunc,
      override: updateFuncOverride,
    }),
    popFunc: makeFunc({
      idKey,
      beforeUpdate,
      func: popFunc,
      override: popFuncOverride,
    }),
    pushFunc: makeFunc({
      idKey,
      beforeUpdate,
      func: pushFunc,
      override: pushFuncOverride,
    }),
  };
});

export default AutoFormContainer;
