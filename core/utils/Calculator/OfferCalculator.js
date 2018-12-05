// @flow
import { FinanceCalculator } from '../FinanceCalculator';
import { OFFER_TYPE, INTEREST_RATES } from '../../api/constants';

export const withOfferCalculator = (SuperClass = class {}) =>
  class extends SuperClass {};

export const OfferCalculator = withOfferCalculator(FinanceCalculator);

export default new OfferCalculator();
