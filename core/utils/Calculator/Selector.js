// @flow
import { createSelector } from 'reselect';
import type { userLoan, userProperty } from '../../api/types';

export const withSelector = (SuperClass = class {}) =>
  class extends SuperClass {
    selectProperty({ loan }: { loan: userLoan } = {}): userProperty {
      return loan.structure.property;
    }

    makeSelectPropertyKey(key: string): Function {
      return ({ loan }) =>
        createSelector(
          this.selectProperty,
          property => property && property[key],
        )({ loan });
    }

    selectPropertyValue({ loan }: { loan: userLoan } = {}): number {
      return this.makeSelectPropertyKey('value')({ loan });
    }

    selectPropertyWork({ loan }: { loan: userLoan } = {}): number {
      return this.makeSelectPropertyKey('propertyWork')({ loan });
    }

    selectLoanValue({ loan }: { loan: userLoan } = {}): number {
      return loan.structure.wantedLoan;
    }
  };

export const Selector = withSelector();

export default new Selector();
