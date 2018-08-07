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

    getTotalUsed({
      loan: {
        structure: { secondPillarPledged, thirdPillarPledged, fortuneUsed },
      },
    }) {
      return secondPillarPledged + thirdPillarPledged + fortuneUsed;
    }

    getFees({ loan }): number {
      const notaryFees = this.selectPropertyValue({ loan }) * this.notaryFees;

      return notaryFees;
    }

    isLoanValid = ({ loan, borrowers, property }) => {
      const incomeRatio = this.getIncomeRatio({ loan, borrowers, property });
      const borrowRatio = this.getBorrowRatio({ loan, borrowers, property });
      const fees = this.getFees({ loan, property });
      const propAndWork = this.getPropAndWork({ loan, property });

      const cashRequired = this.minCash * propAndWork + fees;

      if (incomeRatio > 0.38) {
        throw new Error('income');
      } else if (loan.general.fortuneUsed < cashRequired) {
        throw new Error('cash');
      } else if (borrowRatio > 0.8) {
        throw new Error('ownFunds');
      }

      return true;
    };

    getInterests({ loan, interestRates }) {
      let finalInterestRates = interestRates || this.interestRates;
      const offer = this.makeSelectStructureKey('offer')({ loan });
      if (offer) {
        finalInterestRates = offer;
      }

      return (
        (this.getInterestsWithTranches({
          tranches: this.makeSelectStructureKey('loanTranches')({ loan }),
          interestRates: finalInterestRates,
        })
          * this.getEffectiveLoan({ loan }))
        / 12
      );
    }

    getTheoreticalInterests({ loan }) {
      return (
        (this.getEffectiveLoan({ loan }) * this.theoreticalInterestRate) / 12
      );
    }

    getAmortization({ loan }) {
      return (
        (this.getAmortizationRate({ loan }) * this.getEffectiveLoan({ loan }))
        / 12
      );
    }

    getMonthly({ loan, interestRates }) {
      return (
        this.getInterests({ loan, interestRates })
        + this.getAmortization({ loan })
      );
    }

    getTheoreticalMonthly({ loan }) {
      return (
        this.getTheoreticalInterests({ loan }) + this.getAmortization({ loan })
      );
    }

    getIncomeRatio({ loan }) {
      return (
        this.getTheoreticalMonthly({ loan })
        / this.getTotalIncome({ borrowers: loan.borrowers })
        / 12
      );
    }

    getBorrowRatio({ loan }) {
      return (
        this.makeSelectStructureKey('wantedLoan')({ loan })
        / this.selectPropertyValue({ loan })
      );
    }

    getMaxBorrowRatio({
      loan: {
        general: { usageType },
      },
    }) {
      return this.maxBorrowRatio;
    }

    getNotaryFees({ loan }) {
      return this.selectPropertyValue({ loan }) * this.notaryFees;
    }

    loanHasMinimalInformation({
      loan: {
        structure: { property, fortuneUsed },
      },
    }) {
      return !!(fortuneUsed && (property && property.value));
    }

    getLenderCount({ loan }) {
      const incomeRatio = this.getIncomeRatio({ loan });
      const borrowRatio = this.getBorrowRatio({ loan });
      if (incomeRatio > 0.38) {
        return 0;
      }
      if (incomeRatio > 1 / 3) {
        return 4;
      }
      if (borrowRatio <= 0.65) {
        return 20;
      }
      if (borrowRatio > 0.65 && borrowRatio <= 0.9) {
        return 10;
      }
      return 0;
    }
  };

export const LoanCalculator = withLoanCalculator(FinanceCalculator);

export default new LoanCalculator({});
