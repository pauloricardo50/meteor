// @flow
import {
  MAINTENANCE_REAL,
  DEFAULT_AMORTIZATION,
} from '../../config/financeConstants';
import { OFFER_TYPE } from '../../api/constants';
import { withSelector } from './Selector';

export const withCombinedCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    // add combined functions here
    getInterestsWithOffer({ loan, offer, isStandard = true }) {
      if (!offer) {
        return 0;
      }

      const tranches = loan.general.loanTranches;
      const interestRates = isStandard
        ? offer.standardOffer
        : offer.counterpartOffer;

      let interests = 0;
      tranches.every((tranche) => {
        const rate = interestRates[tranche.type];

        // If the lender doesn't have this interest rate, return false
        if (!rate) {
          interests = -1;
          // break loop
          return false;
        }

        interests += tranche.value * rate;
        return true;
      });

      return interests >= 0 ? Math.round(interests / 12) : interests;
    }

    getMonthlyWithOffer({
      loan,
      offer,
      isStandard = true,
      fortuneUsed = 0,
      insuranceFortuneUsed = 0,
    }) {
      // Return undefined if the counterpartOffer doesn't exist
      if (!isStandard && !offer.counterpartOffer) {
        return undefined;
      }

      // Make a copy of the loan
      // Modify it to include additional parameters

      const r = {
        ...loan,
        general: {
          ...loan.general,
          fortuneUsed: fortuneUsed || loan.general.fortuneUsed,
          insuranceFortuneUsed:
            insuranceFortuneUsed || loan.general.insuranceFortuneUsed,
        },
      };

      const loanValue = this.selectLoanValue({ loan: r });

      const maintenance = MAINTENANCE_REAL
        * (this.selectPropertyValue({ loan: r })
          + (this.selectPropertyWork({ loan: r }) || 0));

      let amortization = isStandard
        ? offer.standardOffer.amortization
        : offer.counterpartOffer.amortization;
      amortization = amortization || DEFAULT_AMORTIZATION;

      const interests = this.getInterestsWithOffer({
        loan: r,
        offer,
        isStandard: true,
      });

      return interests >= 0
        ? Math.round((maintenance + loanValue * amortization + interests) / 12) || 0
        : 0;
    }

    getMonthlyWithExtractedOffer({ loan, offer, property }) {
      this.getMonthlyWithOffer({
        loan,
        property,
        offer: {
          [offer.type === OFFER_TYPE.STANDARD
            ? 'standardOffer'
            : 'counterpartOffer']: offer,
        },
        isStandard: offer.type === OFFER_TYPE.STANDARD,
      });
    }
  };

export const CombinedCalculator = withSelector(withCombinedCalculator());

export default new CombinedCalculator();
