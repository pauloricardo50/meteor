import { withProps } from 'recompose';

import {
  LOANS_COLLECTION,
  BORROWERS_COLLECTION,
  PROPERTIES_COLLECTION,
  MORTGAGE_NOTES_COLLECTION,
} from '../../api/constants';
import * as methods from '../../api/methods';

const createParams = ({ id, ...rest }, idKey) => ({ [idKey]: id, ...rest });

const makeFunc = ({ idKey, beforeUpdate, func }) => (rawParams) => {
  const params = createParams(rawParams, idKey);
  if (beforeUpdate) {
    beforeUpdate(params);
  }

  return methods[func].run(params);
};

const AutoFormContainer = withProps(({ collection, beforeUpdate, overrides = {} }) => {
  let popFunc;
  let pushFunc;
  let updateFunc;
  let idKey;

  const {
    popFunc: popFuncOverride,
    pushFunc: pushFuncOverride,
    updateFunc: updateFuncOverride,
  } = overrides;

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
    updateFunc: makeFunc({
      idKey,
      beforeUpdate,
      func: updateFuncOverride || updateFunc,
    }),
    popFunc: makeFunc({
      idKey,
      beforeUpdate,
      func: popFuncOverride || popFunc,
    }),
    pushFunc: makeFunc({
      idKey,
      beforeUpdate,
      func: pushFuncOverride || pushFunc,
    }),
  };
});

export default AutoFormContainer;
