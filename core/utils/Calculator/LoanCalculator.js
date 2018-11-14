// @flow
import { OWN_FUNDS_TYPES } from 'core/api/constants';
import { FinanceCalculator } from '../FinanceCalculator';
import { getLoanDocuments } from '../../api/files/documents';
import { OWN_FUNDS_USAGE_TYPES } from '../../api/constants';
import {
  filesPercent,
  getMissingDocumentIds,
} from '../../api/files/fileHelpers';

export const withLoanCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    getProjectValue({ loan }) {
      const propertyValue = this.getPropertyValue({ loan });
      if (!propertyValue) {
        return 0;
      }

      const value = propertyValue
        + (this.selectStructureKey({ loan, key: 'propertyWork' }) || 0)
        + this.getFees({ loan });

      return value;
    }

    getTotalUsed({ loan: { structure: { ownFunds = [] } = {} } }) {
      return ownFunds.reduce((sum, { value }) => sum + value, 0);
    }

    getTotalPledged({ loan: { structure: { ownFunds = [] } = {} } }) {
      return ownFunds
        .filter(({ usageType }) => usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE)
        .reduce((sum, { value }) => sum + value, 0);
    }

    getFees({ loan }): number {
      const notaryFees = this.selectStructureKey({ loan, key: 'notaryFees' });
      const defaultNotaryFees = this.getPropertyValue({ loan }) * this.notaryFees;

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

    getTheoreticalMaintenance({ loan }) {
      return (
        (this.getPropAndWork({ loan }) * this.theoreticalMaintenanceRate) / 12
      );
    }

    getAmortization({ loan }) {
      return (
        (this.getAmortizationRate({ loan }) * this.selectLoanValue({ loan }))
        / 12
      );
    }

    getAmortizationRate({ loan }) {
      const {
        structure: { wantedLoan, propertyWork },
      } = loan;
      return this.getAmortizationRateBase({
        borrowRatio:
          wantedLoan / (this.getPropertyValue({ loan }) + propertyWork),
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
        this.getTheoreticalInterests({ loan })
        + this.getAmortization({ loan })
        + this.getTheoreticalMaintenance({ loan })
      );
    }

    getIncomeRatio({ loan }) {
      return (
        this.getTheoreticalMonthly({ loan })
        / (this.getTotalIncome({ borrowers: loan.borrowers }) / 12)
      );
    }

    getBorrowRatio({ loan }) {
      return (
        this.selectStructureKey({ loan, key: 'wantedLoan' })
        / (this.getPropertyValue({ loan })
          + this.selectStructureKey({ loan, key: 'propertyWork' }))
      );
    }

    getMaxBorrowRatio({ loan: { usageType } }) {
      return this.maxBorrowRatio;
    }

    loanHasMinimalInformation({
      loan: {
        structure: { property, ownFunds, wantedLoan },
      },
    }) {
      return !!(
        ownFunds
        && ownFunds.length > 0
        && (property && property.value)
        && wantedLoan
      );
    }

    getLoanFilesProgress({ loan }) {
      return filesPercent({ fileArray: getLoanDocuments({ loan }), doc: loan });
    }

    getMissingLoanDocuments({ loan }) {
      return getMissingDocumentIds({
        fileArray: getLoanDocuments({ loan }),
        doc: loan,
      });
    }

    getTotalFinancing({ loan }) {
      return (
        this.selectStructureKey({ loan, key: 'wantedLoan' })
        + this.getNonPledgedOwnFunds({ loan })
      );
    }

    getNonPledgedOwnFunds({ loan }) {
      const ownFunds = this.selectStructureKey({ loan, key: 'ownFunds' }) || [];
      return ownFunds
        .filter(({ usageType }) => usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
        .reduce((sum, { value }) => sum + value, 0);
    }

    getUsedFundsOfType({ loan, type, usageType }) {
      const ownFunds = this.selectStructureKey({ loan, key: 'ownFunds' }) || [];
      return ownFunds
        .filter(({ type: ownFundType }) => (type ? ownFundType === type : true))
        .filter(({ usageType: ownFundUsageType }) =>
          (usageType ? ownFundUsageType === usageType : true))
        .reduce((sum, { value }) => sum + value, 0);
    }

    getRemainingFundsOfType({ loan, type }) {
      const ownFunds = this.getFunds({ loan, type });
      return (
        ownFunds
        - this.getUsedFundsOfType({
          loan,
          type,
          usageType:
            type !== OWN_FUNDS_TYPES.BANK_FORTUNE
              ? OWN_FUNDS_USAGE_TYPES.WITHDRAW
              : undefined,
        })
      );
    }

    getTotalRemainingFunds({ loan }) {
      return Object.values(OWN_FUNDS_TYPES).reduce(
        (sum, type) => sum + this.getRemainingFundsOfType({ loan, type }),
        0,
      );
    }
  };

export const LoanCalculator = withLoanCalculator(FinanceCalculator);

export default new LoanCalculator({});
