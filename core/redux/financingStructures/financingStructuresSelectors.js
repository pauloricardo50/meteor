// @flow
import { createSelector } from 'reselect';

export const selectLoan = state => state.financingStructures.loan;
export const selectProperties = state => state.financingStructures.properties;
export const selectStructures = state => state.financingStructures.structures;
export const selectStructuresArray = state => Object.values(state.financingStructures.structures);

export const makeSelectStructure = (structureId: string) => createSelector(selectStructures, structures => structures[structureId]);

export const makeSelectStructureValue = (structureId: string, key: string) => createSelector(makeSelectStructure(structureId), structure => structure[key]);

export const makeSelectPropertyValue = (
  structureId: string,
  key: string = 'value',
) => createSelector(
  makeSelectStructureValue(structureId, 'propertyId'),
  selectProperties,
  (propertyId, properties) => properties[propertyId] && properties[propertyId][key],
);
