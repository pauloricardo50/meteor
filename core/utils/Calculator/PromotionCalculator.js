import pick from 'lodash/pick';

import { PURCHASE_TYPE } from '../../api/loans/loanConstants';
import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_STATUS,
} from '../../api/promotionOptions/promotionOptionConstants';
import { PROMOTION_TYPES } from '../../api/promotions/promotionConstants';
import { sortByStatus } from '../sorting';

export const withPromotionCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    canAffordPromotionLot({ loan, promotionLot }) {
      const { value, notaryFees } = promotionLot;
      return true;
    }

    getSolvency({ loan, notaryFees = 0 }) {
      const bankFortune = this.getFortune({ loan });
      const cashFortune = this.getCashFortune({ loan });
      const insurance2 = this.getInsurance2({ loan });

      const results = {
        withBankFortune: Math.round(
          (bankFortune - notaryFees) / (1 - this.getMaxBorrowRatio({ loan })),
        ),
        withInsurance2: this.getMaxPropertyValueWithInsurance2({
          loan,
          cash: bankFortune,
          insurance2,
          notaryFees,
        }),
        withInsurance3: Math.round(
          (cashFortune - notaryFees) / (1 - this.getMaxBorrowRatio({ loan })),
        ),
        withInsurance2And3: this.getMaxPropertyValueWithInsurance2({
          loan,
          cash: cashFortune,
          insurance2,
          notaryFees,
        }),
      };

      return Object.keys(results).reduce(
        (obj, key) => ({ ...obj, [key]: Math.round(results[key]) }),
        {},
      );
    }

    getMaxPropertyValueWithInsurance2({ loan, cash, insurance2, notaryFees }) {
      const availableFortune = cash - notaryFees;
      const maxPropertyValue = availableFortune / this.minCash;
      const canAffordProperty =
        (maxPropertyValue - availableFortune - insurance2) / maxPropertyValue <=
        this.getMaxBorrowRatio({ loan });

      if (canAffordProperty) {
        return Math.round(maxPropertyValue);
      }

      return Math.round(
        (availableFortune + insurance2) /
          (1 - this.getMaxBorrowRatio({ loan })),
      );
    }

    getIncomeLimitedProperty({
      borrowers,
      income,
      fortune,
      propertyValue,
      notaryFees,
    }) {
      return this.getIncomeLimitedPropertyValue({
        nF: notaryFees / propertyValue,
        r: this.getAmortizationYears({ borrowers }),
        i: this.theoreticalInterestRate,
        mR: this.maxIncomeRatio,
        m: this.theoreticalMaintenanceRate,
      })({ income, fortune });
    }

    formatPromotionOptionIntoProperty(promotionOption) {
      if (!promotionOption) {
        return;
      }

      const { promotionLots = [] } = promotionOption;
      const [promotionLot] = promotionLots;

      if (!promotionLot) {
        return;
      }

      const { properties = [] } = promotionLot;
      const [property] = properties;

      return {
        // Get the address from the promotion
        ...pick(promotionOption.promotion, [
          'address1',
          'address2',
          'zipCode',
          'city',
        ]),
        ...promotionOption,
        ...property,
        totalValue: promotionOption.value,
      };
    }

    shouldUseConstructionNotaryFees({ loan, structureId }) {
      const { promotions } = loan;

      if (!this.isPromotionProperty({ loan, structureId })) {
        return false;
      }

      if (!promotions || (promotions.length && promotions.length === 0)) {
        return false;
      }

      const [promotion] = promotions;

      return promotion.type === PROMOTION_TYPES.SHARE;
    }

    hasActivePromotionOption({ loan: { promotionOptions = [] } }) {
      return (
        promotionOptions.length > 0 &&
        promotionOptions.some(
          ({ status }) => PROMOTION_OPTION_STATUS.INTERESTED !== status,
        )
      );
    }

    getActivePromotionOptions({ loan: { promotionOptions = [] } }) {
      return promotionOptions.filter(
        ({ status }) => PROMOTION_OPTION_STATUS.INTERESTED !== status,
      );
    }

    getMostActivePromotionOption({ loan: { promotionOptions = [] } }) {
      const sorted = promotionOptions.sort(
        sortByStatus(Object.values(PROMOTION_OPTION_STATUS)),
      );
      return sorted.slice(-1)[0];
    }

    isActivePromotionOption({ promotionOption: { status } }) {
      return ![
        PROMOTION_OPTION_STATUS.INTERESTED,
        PROMOTION_OPTION_STATUS.RESERVATION_REQUESTED,
      ].includes(status);
    }

    canConfirmPromotionLotReservation({
      promotionOption: {
        bank,
        simpleVerification,
        fullVerification,
        reservationAgreement,
        reservationDeposit,
      },
    }) {
      return (
        [
          PROMOTION_OPTION_BANK_STATUS.VALIDATED,
          PROMOTION_OPTION_BANK_STATUS.VALIDATED_WITH_CONDITIONS,
        ].includes(bank.status) &&
        reservationDeposit.status === PROMOTION_OPTION_DEPOSIT_STATUS.PAID &&
        simpleVerification.status ===
          PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.VALIDATED &&
        fullVerification.status ===
          PROMOTION_OPTION_FULL_VERIFICATION_STATUS.VALIDATED &&
        reservationAgreement.status ===
          PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED
      );
    }
  };
