// @flow
import debounce from 'lodash/debounce';

import { normalize } from '../../utils/general';
import { updateStructure } from '../../api';
import {
  REHYDRATE_LOAN,
  UPDATE_STRUCTURE,
  REHYDRATE_PROPERTIES,
  REHYDRATE_BORROWERS,
} from './financingTypes';
import { rehydrateData } from './financingActions';
import type { Action } from './financingActions';
import {
  makeSelectStructure,
  selectLoan,
} from './financingSelectors';

// Just for sliders
export const DEBOUNCE_TIMEOUT_MS = 50;

export const saveStructures = debounce((saveDataFunc, ids, getState) => {
  const idsToUse = [...ids];
  ids.splice(0, ids.length); // Empty the ids array when this function runs

  const store = getState();
  const loanId = selectLoan(store)._id;
  return Promise.all(idsToUse.map((structureId) => {
    const structure = makeSelectStructure(structureId)(store);
    return saveDataFunc({ structureId, structure, loanId });
  }));
}, DEBOUNCE_TIMEOUT_MS);

export const rehydrateMiddleware = ({ dispatch, getState }) => next => (action: Action) => {
  if (action.type === REHYDRATE_LOAN) {
    const { loan } = action.payload;
    dispatch(rehydrateData(loan, 'loan'));
    dispatch(rehydrateData(normalize(loan.structures), 'structures'));
    dispatch(rehydrateData(normalize(loan.borrowers), 'borrowers'));
    dispatch(rehydrateData(normalize(loan.properties), 'properties'));
    return;
  }

  if (action.type === REHYDRATE_PROPERTIES) {
    const { properties } = action.payload;
    dispatch(rehydrateData(normalize(properties), 'properties'));
    return;
  }

  if (action.type === REHYDRATE_BORROWERS) {
    const { borrowers } = action.payload;
    dispatch(rehydrateData(normalize(borrowers), 'borrowers'));
    return;
  }

  return next(action);
};

export const makeSaveDataMiddleware = (saveDataFunc) => {
  const updatedIds = [];
  return ({ dispatch, getState }) => next => (action: Action) => {
    if (action.type === UPDATE_STRUCTURE) {
      const { structureId } = action.payload;

      if (!updatedIds.includes(structureId)) {
        updatedIds.push(structureId);
      }
      saveStructures(saveDataFunc, updatedIds, getState);
    }

    return next(action);
  };
};

export const saveDataMiddleWare = makeSaveDataMiddleware(params =>
  updateStructure.run(params));

export const financingMiddleware = [
  rehydrateMiddleware,
  saveDataMiddleWare,
];
