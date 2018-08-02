// @flow
import { FinanceCalculator } from '../FinanceCalculator';

export const withLoanCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    getPropertyValue({ loan }) {
      return loan.structure.property && loan.structure.property.value;
    }

    getStructureValue({ loan, key }) {
      return loan.structure[key];
    }

    getProjectValue({ loan }) {
      const propertyValue = this.getPropertyValue({ loan });
      if (!propertyValue) {
        return 0;
      }

      const value = propertyValue * (1 + this.notaryFees)
        + (this.getStructureValue({ loan, key: 'propertyWork' }) || 0);

      return value;
    }
  };

export const LoanCalculator = withLoanCalculator(FinanceCalculator);

export default new LoanCalculator({});
