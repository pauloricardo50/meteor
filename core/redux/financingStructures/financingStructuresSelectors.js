// @flow
import { createSelector } from 'reselect';

export const selectLoan = state => state.financingStructures.loan;
export const selectStructures = state => state.financingStructures.structures;

export const makeSelectStructure = (structureId: string) =>
  createSelector(selectStructures, structures => structures[structureId]);

export const makeSelectStructureValue = (structureId: string, key: string) =>
  createSelector(makeSelectStructure(structureId), structure => structure[key]);
