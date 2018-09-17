// @flow
import type { userLoan } from '../../api/types';
import {
  REHYDRATE_DATA,
  REHYDRATE_LOAN,
  REHYDRATE_PROPERTIES,
  REHYDRATE_BORROWERS,
  UPDATE_STRUCTURE,
} from './financingStructuresTypes';

export const rehydrateLoan = (loan: userLoan) => ({
  type: REHYDRATE_LOAN,
  payload: { loan },
});
export const rehydrateProperties = (properties: userLoan) => ({
  type: REHYDRATE_PROPERTIES,
  payload: { properties },
});
export const rehydrateBorrowers = (borrowers: userLoan) => ({
  type: REHYDRATE_BORROWERS,
  payload: { borrowers },
});

export const rehydrateData = (data, dataName): Action => ({
  type: REHYDRATE_DATA,
  payload: { data, dataName },
});

export const updateStructure = (structureId, structure): Action => ({
  type: UPDATE_STRUCTURE,
  payload: { structureId, structure },
});

type rehydrateLoanType = $Call<typeof rehydrateLoan>;

type rehydrateDataType = {
  type: REHYDRATE_DATA,
  payload: {
    data: Array<{}> | {},
    dataName: 'loan' | 'properties' | 'borrowers' | 'structures',
  },
};

type updateStructureType = {
  type: REHYDRATE_LOAN,
  payload: { structureId: string, structure: {} },
};

export type Action =
  | rehydrateLoanType
  | rehydrateDataType
  | updateStructureType;
