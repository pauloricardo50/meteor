// @flow
import debounce from 'lodash/debounce';
import { REHYDRATE_LOAN, UPDATE_STRUCTURE } from './financingStructuresTypes';
import { rehydrateData } from './financingStructuresActions';
import type { Action } from './financingStructuresActions';
import { selectStructure, selectLoan } from './financingStructuresSelectors';
import { normalize } from '../../utils/general';
import { updateStructure } from '../../api';

const DEBOUNCE_TIMEOUT_MS = 500;

const saveStructures = debounce((saveDataFunc, ids, getState) => {
  ids = []; // Immediately reset ids so they start accumulating again
  const store = getState();
  const loanId = selectLoan(store)._id;
  return Promise.all(ids.map((structureId) => {
    const structure = selectStructure(structureId)(store);
    return saveDataFunc({ structureId, structure, loanId });
  }));
}, DEBOUNCE_TIMEOUT_MS);

export const rehydrateMiddleware = ({ dispatch }) => next => (action: Action) => {
  if (action.type === REHYDRATE_LOAN) {
    const { loan } = action.payload;
    dispatch(rehydrateData(loan, 'loan'));
    dispatch(rehydrateData(normalize(loan.structures), 'structures'));
    dispatch(rehydrateData(normalize(loan.borrowers), 'borrowers'));
    dispatch(rehydrateData(normalize(loan.properties), 'properties'));
    return next();
  }
  return next(action);
};

export const makeSaveDataMiddleware = (saveDataFunc) => {
  const updatedIds = [];
  return ({ dispatch, getState }) => next => (action: Action) => {
    if (action.type === UPDATE_STRUCTURE) {
      const { structureId } = action.payload;
      if (updatedIds.includes(structureId)) {
        updatedIds.push(structureId);
      }
      saveStructures(saveDataFunc, updatedIds, getState);
    }
    return next(action);
  };
};

export const saveDataMiddleWare = makeSaveDataMiddleware((id, data) =>
  updateStructure.run({ structureId: id, structure: data }));
