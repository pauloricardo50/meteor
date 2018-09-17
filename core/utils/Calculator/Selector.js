// @flow
import { createSelector } from 'reselect';
import type { userLoan, userProperty } from '../../api/types';

export const withSelector = (SuperClass = class {}) =>
  class extends SuperClass {
    selectProperty({ loan }: { loan: userLoan } = {}): userProperty {
      return loan.structure.property;
    }

    selectStructure({ loan }: { loan: userLoan } = {}): {} {
      return loan.structure;
    }

    selectLoanValue({ loan }) {
      return createSelector(
        this.selectStructure,
        structure => structure && structure.wantedLoan,
      );
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
      return createSelector(this.selectStructure, structure => structure[key]);
    }

    selectPropertyValue({ loan }: { loan: userLoan } = {}): number {
      return this.makeSelectPropertyKey('value')({ loan });
    }

    selectPropertyWork({ loan }: { loan: userLoan } = {}): number {
      return this.makeSelectStructureKey('propertyWork')({ loan });
    }

    selectLoanValue({ loan }: { loan: userLoan } = {}): number {
      return loan.structure.wantedLoan;
    }

    getCashUsed = this.makeSelectStructureKey('fortuneUsed');
  };

export const Selector = withSelector();

export default new Selector();
