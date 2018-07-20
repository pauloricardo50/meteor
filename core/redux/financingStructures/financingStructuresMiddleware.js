// @flow
import debounce from 'lodash/debounce';

import { normalize } from '../../utils/general';
import { updateStructure } from '../../api';
import { REHYDRATE_LOAN, UPDATE_STRUCTURE } from './financingStructuresTypes';
import { rehydrateData } from './financingStructuresActions';
import type { Action } from './financingStructuresActions';
import {
  makeSelectStructure,
  selectLoan,
} from './financingStructuresSelectors';

const DEBOUNCE_TIMEOUT_MS = 500;

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
    const {
      financingStructures: { isLoaded },
    } = getState();
    const { loan } = action.payload;
    dispatch(rehydrateData(loan, 'loan'));
    // if (!isLoaded) {
    dispatch(rehydrateData(normalize(loan.structures), 'structures'));
    // }
    dispatch(rehydrateData(normalize(loan.borrowers), 'borrowers'));
    dispatch(rehydrateData(loan.property, 'property'));
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

export const financingStructuresMiddleware = [
  rehydrateMiddleware,
  saveDataMiddleWare,
];
