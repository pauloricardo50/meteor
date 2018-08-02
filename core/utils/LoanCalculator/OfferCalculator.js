// @flow
import { FinanceCalculator } from '../FinanceCalculator';

export const withOfferCalculator = (SuperClass = class {}) =>
  class extends SuperClass {};

export const OfferCalculator = withOfferCalculator(FinanceCalculator);

export default new OfferCalculator();
