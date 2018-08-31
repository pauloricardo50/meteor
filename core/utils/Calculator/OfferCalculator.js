// @flow
import { FinanceCalculator } from '../FinanceCalculator';
import { OFFER_TYPE, INTEREST_RATES } from '../../api/constants';

// TODO: Refactor offers
export const withOfferCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    addMetadataToOffer({ offer, loan }) {
      // TODO: Plug this with the loan
      return { ...offer, monthly: 100 };
    }
  };

export const OfferCalculator = withOfferCalculator(FinanceCalculator);

export default new OfferCalculator();
