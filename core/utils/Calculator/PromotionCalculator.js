import pick from 'lodash/pick';

import {
  PROMOTION_TYPES,
  PURCHASE_TYPE,
  PROMOTION_OPTION_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
} from '../../api/constants';
import { sortByStatus } from '../sorting';

export const withPromotionCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    canAffordPromotionLot({ loan, promotionLot }) {
      const { value, notaryFees } = promotionLot;
      return true;
    }

    getSolvency({ loan, notaryFees = 0 }) {
      const income = this.getTotalIncome({ loan });
      const bankFortune = this.getFortune({ loan });
      const cashFortune = this.getCashFortune({ loan });
      const insurance2 = this.getInsurance2({ loan });

      const results = {
        withBankFortune: Math.round((bankFortune - notaryFees) / (1 - this.getMaxBorrowRatio({ loan }))),
        withInsurance2: this.getMaxPropertyValueWithInsurance2({
          cash: bankFortune,
          insurance2,
          notaryFees,
        }),
        withInsurance3: Math.round((cashFortune - notaryFees) / (1 - this.getMaxBorrowRatio({ loan }))),
        withInsurance2And3: this.getMaxPropertyValueWithInsurance2({
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

    getMaxPropertyValueWithInsurance2({ cash, insurance2, notaryFees }) {
      const availableFortune = cash - notaryFees;
      const maxPropertyValue = availableFortune / this.minCash;
      const canAffordProperty = (maxPropertyValue - availableFortune - insurance2) / maxPropertyValue
        <= this.getMaxBorrowRatio();

      if (canAffordProperty) {
        return Math.round(maxPropertyValue);
      }

      return Math.round((availableFortune + insurance2)
          / (1 - this.getMaxBorrowRatio()));
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
        r: this.getAmortizationDuration({ borrowers }),
        i: this.theoreticalInterestRate,
        mR: this.maxIncomeRatio,
        m: this.theoreticalMaintenanceRate,
      })({ income, fortune });
    }

    formatPromotionOptionIntoProperty(promotionOption) {
      if (!promotionOption) {
        return;
      }

      const property = promotionOption.promotionLots[0].properties[0];

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

      if (loan.purchaseType === PURCHASE_TYPE.CONSTRUCTION) {
        return true;
      }

      if (!this.isPromotionProperty({ loan, structureId })) {
        return false;
      }

      if (!promotions || (promotions.length && promotions.length === 0)) {
        return false;
      }

      const promotion = promotions[0];

      return promotion.type === PROMOTION_TYPES.SHARE;
    }

    hasActivePromotionOption({ loan: { promotionOptions = [] } }) {
      return (
        promotionOptions.length > 0
        && promotionOptions.some(({ status }) => PROMOTION_OPTION_STATUS.INTERESTED !== status)
      );
    }

    getActivePromotionOptions({ loan: { promotionOptions = [] } }) {
      return promotionOptions.filter(({ status }) => PROMOTION_OPTION_STATUS.INTERESTED !== status);
    }

    getMostActivePromotionOption({ loan: { promotionOptions = [] } }) {
      const sorted = promotionOptions.sort(sortByStatus(Object.values(PROMOTION_OPTION_STATUS)));
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
        deposit,
      },
    }) {
      return (
        [
          PROMOTION_OPTION_BANK_STATUS.VALIDATED,
          PROMOTION_OPTION_BANK_STATUS.VALIDATED_WITH_CONDITIONS,
        ].includes(bank.status)
        && deposit.status === PROMOTION_OPTION_DEPOSIT_STATUS.PAID
        && simpleVerification.status
          === PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.SOLVENT
        && fullVerification.status
          === PROMOTION_OPTION_FULL_VERIFICATION_STATUS.SOLVENT
        && reservationAgreement.status
          === PROMOTION_OPTION_AGREEMENT_STATUS.RECEIVED
      );
    }
  };
