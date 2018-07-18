import { createSelector } from 'reselect';

export const selectLoan = state => state.financingStructures.loan;
export const selectStructures = state => state.financingStructures.structures;

export const selectStructure = structureId =>
  createSelector(selectStructures, structures => structures[structureId]);
