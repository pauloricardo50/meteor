// @flow
import { createSelector } from 'reselect';
import { userLoan, userProperty } from '../../api/types';

export const withSelector = (SuperClass = class {}) =>
  class extends SuperClass {
    selectProperty({
      loan,
      structureId,
    }: { loan: userLoan } = {}): userProperty {
      if (structureId) {
        const { propertyId } = loan.structures.find(({ id }) => id === structureId);
        return loan.properties.find(({ _id }) => _id === propertyId);
      }
      return loan.structure.property;
    }

    selectStructure({ loan, structureId }: { loan: userLoan } = {}): {} {
      if (structureId) {
        return loan.structures.find(({ id }) => id === structureId);
      }
      return loan.structure;
    }

    makeSelectPropertyKey(key: string): Function {
      return createSelector(
        this.selectProperty,
        property => property && property[key],
      );
    }

    selectStructureKey({ loan, key }) {
      return this.makeSelectStructureKey(key)({ loan });
    }

    makeSelectStructureKey(key: string): Function {
      return createSelector(
        this.selectStructure,
        structure => structure[key],
      );
    }

    selectPropertyValue({
      loan,
      structureId,
    }: { loan: userLoan } = {}): number {
      return this.makeSelectPropertyKey('value')({ loan, structureId });
    }

    selectPropertyWork({ loan }: { loan: userLoan } = {}): number {
      return this.makeSelectStructureKey('propertyWork')({ loan });
    }

    selectLoanValue({ loan, structureId }: { loan: userLoan } = {}): number {
      return this.selectStructure({ loan, structureId }).wantedLoan;
    }

    getCashUsed = this.makeSelectStructureKey('fortuneUsed');
  };

export const Selector = withSelector();

export default new Selector();
