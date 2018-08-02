// @flow
import { createSelector } from 'reselect';

export const withSelector = (SuperClass = class {}) =>
  class extends SuperClass {
    selectProperty({ loan }) {
      return loan.structure.property;
    }

    makeSelectPropertyKey(key) {
      return ({ loan }) =>
        createSelector(
          this.selectProperty,
          property => property && property[key],
        )({ loan });
    }

    selectPropertyValue({ loan }) {
      return this.makeSelectPropertyKey('value')({ loan });
    }

    selectPropertyWork({ loan }) {
      return this.makeSelectPropertyKey('propertyWork')({ loan });
    }

    selectLoanValue({ loan }) {
      return loan.structure.wantedLoan;
    }
  };

export const Selector = withSelector();

export default new Selector();
