import { FinanceCalculator } from '../FinanceCalculator';

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
        withBankFortune: Math.round((bankFortune - notaryFees) / (1 - this.maxBorrowRatio)),
        withInsurance2: this.getMaxPropertyValueWithInsurance2({
          cash: bankFortune,
          insurance2,
          notaryFees,
        }),
        withInsurance3: Math.round((cashFortune - notaryFees) / (1 - this.maxBorrowRatio)),
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
        <= this.maxBorrowRatio;

      if (canAffordProperty) {
        return Math.round(maxPropertyValue);
      }

      return Math.round((availableFortune + insurance2) / (1 - this.maxBorrowRatio));
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

      return {
        ...promotionOption.promotionLots[0].properties[0],
        ...promotionOption,
      };
    }
  };

export const PromotionCalculator = withPromotionCalculator(FinanceCalculator);

export default new PromotionCalculator({});
