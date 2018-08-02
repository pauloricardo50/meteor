// @flow
import { FinanceCalculator } from '../FinanceCalculator';

export const withPropertyCalculator = (SuperClass = class {}) =>
  class extends SuperClass {};

export const PropertyCalculator = withPropertyCalculator(FinanceCalculator);
export default new PropertyCalculator();
