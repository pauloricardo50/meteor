// @flow
import { FinanceCalculator } from '../FinanceCalculator';
import { loanDocuments } from '../../api/files/documents';
import { FILE_STEPS } from '../../api/constants';
import {
  filesPercent,
  getMissingDocumentIds,
} from '../../api/files/fileHelpers';

const FinanceCalc = new FinanceCalculator();

export const withLoanCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    getProjectValue({ loan }) {
      const propertyValue = this.selectPropertyValue({ loan });
      if (!propertyValue) {
        return 0;
      }

      const value = propertyValue * (1 + this.notaryFees)
        + (this.selectStructureKey({ loan, key: 'propertyWork' }) || 0);

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
      const notaryFees = this.selectStructureKey({ loan, key: 'notaryFees' });
      const defaultNotaryFees = this.selectPropertyValue({ loan }) * this.notaryFees;

      return notaryFees === 0 ? 0 : notaryFees || defaultNotaryFees;
    }

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
          * this.selectLoanValue({ loan }))
        / 12
      );
    }

    getTheoreticalInterests({ loan }) {
      return (
        (this.selectLoanValue({ loan }) * this.theoreticalInterestRate) / 12
      );
    }

    getAmortization({ loan }) {
      return (
        (this.getAmortizationRateRelativeToLoan({ loan })
          * this.selectLoanValue({ loan }))
        / 12
      );
    }

    getAmortizationRate({ loan }) {
      const {
        structure: { wantedLoan, propertyWork },
      } = loan;
      return this._getAmortizationRate({
        borrowRatio:
          wantedLoan / (this.selectPropertyValue({ loan }) + propertyWork),
      });
    }

    getAmortizationRateRelativeToLoan({ loan }) {
      const {
        structure: { wantedLoan, propertyWork },
      } = loan;
      return this._getAmortizationRateRelativeToLoan({
        borrowRatio:
          wantedLoan / (this.selectPropertyValue({ loan }) + propertyWork),
      });
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
        this.selectStructureKey({ loan, key: 'wantedLoan' })
        / (this.selectPropertyValue({ loan })
          + this.selectStructureKey({ loan, key: 'propertyWork' }))
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

    getLoanFilesProgress({ loan }) {
      return filesPercent({
        doc: loan,
        fileArrayFunc: loanDocuments,
        step: FILE_STEPS.AUCTION,
      });
    }

    getMissingLoanDocuments({ loan }) {
      return getMissingDocumentIds({
        doc: loan,
        fileArrayFunc: loanDocuments,
        step: FILE_STEPS.AUCTION,
      });
    }
  };

export const LoanCalculator = withLoanCalculator(FinanceCalculator);

export default new LoanCalculator({});
