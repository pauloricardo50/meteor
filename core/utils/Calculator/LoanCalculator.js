// @flow
import { FinanceCalculator } from '../FinanceCalculator';
import { averageRates } from '../../components/InterestRatesTable/interestRates';

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

    getEffectiveLoan({ loan }) {
      const wantedLoan = this.makeSelectStructureKey('wantedLoan')({ loan });
      const pledgedValue = this.makeSelectStructureKey('secondPillarPledged')({ loan })
        + this.makeSelectStructureKey('thirdPillarPledged')({ loan });
      return super.getEffectiveLoan({ loanValue: wantedLoan, pledgedValue });
    }

    getInterests({ loan, interestRates }) {
      let finalInterestRates = interestRates;
      const offer = this.makeSelectStructureKey('offer')({ loan });
      if (offer) {
        finalInterestRates = offer;
      } else if (!interestRates) {
        finalInterestRates = averageRates;
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
  };

export const LoanCalculator = withLoanCalculator(FinanceCalculator);

export default new LoanCalculator({});
