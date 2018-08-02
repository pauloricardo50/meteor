// @flow
import { FinanceCalculator } from '../FinanceCalculator';

export const withBorrowerCalculator = (SuperClass = class {}) =>
  class extends SuperClass {};

export const BorrowerCalculator = withBorrowerCalculator(FinanceCalculator);
export default new BorrowerCalculator();
