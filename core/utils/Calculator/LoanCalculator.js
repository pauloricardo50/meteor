// @flow
import { OWN_FUNDS_TYPES } from 'core/api/constants';
import { FinanceCalculator } from '../FinanceCalculator';
import { getLoanDocuments } from '../../api/files/documents';
import { OWN_FUNDS_USAGE_TYPES } from '../../api/constants';
import {
  filesPercent,
  getMissingDocumentIds,
} from '../../api/files/fileHelpers';
import getRefinancingFormArray from '../../arrays/RefinancingFormArray';
import { getCountedArray } from '../formArrayHelpers';
import { getPercent } from '../general';
import NotaryFeesCalculator from '../notaryFees/NotaryFeesCalculator';

export const withLoanCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    getProjectValue({ loan, structureId }) {
      const propertyValue = this.selectPropertyValue({ loan, structureId });
      if (!propertyValue) {
        return 0;
      }

      const value = propertyValue
        + (this.selectStructureKey({ loan, key: 'propertyWork', structureId })
          || 0)
        + this.getFees({ loan, structureId }).total;

      return value;
    }

    getTotalUsed({ loan, structureId }) {
      const ownFunds = this.selectStructureKey({
        loan,
        structureId,
        key: 'ownFunds',
      });
      return ownFunds.reduce((sum, { value }) => sum + value, 0);
    }

    getTotalPledged({ loan, structureId }) {
      const ownFunds = this.selectStructureKey({
        loan,
        structureId,
        key: 'ownFunds',
      });
      return ownFunds
        .filter(({ usageType }) => usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE)
        .reduce((sum, { value }) => sum + value, 0);
    }

    getFees({ loan, structureId }): number {
      const notaryFees = this.selectStructureKey({
        loan,
        structureId,
        key: 'notaryFees',
      });

      // Custom notary fees are provided
      if (notaryFees === 0 || notaryFees) {
        return { total: notaryFees };
      }

      const canton = this.makeSelectPropertyKey('canton')({
        loan,
        structureId,
      });
      const calculator = new NotaryFeesCalculator({ canton });

      const calculatedNotaryFees = calculator.getNotaryFeesForLoan({
        loan,
        structureId,
      });

      return calculatedNotaryFees;
    }

    getFeesCalculator({ loan, structureId }) {
      const canton = this.selectPropertyKey({
        loan,
        structureId,
        key: 'canton',
      });
      return new NotaryFeesCalculator({ canton });
    }

    getInterests({ loan, interestRates, structureId }) {
      let finalInterestRates = interestRates || loan.currentInterestRates;
      const offer = this.selectStructureKey({
        loan,
        key: 'offer',
        structureId,
      });
      if (offer) {
        finalInterestRates = offer;
      }

      return (
        (this.getInterestsWithTranches({
          tranches: this.makeSelectStructureKey('loanTranches')({ loan }),
          interestRates: finalInterestRates,
        })
          * this.selectLoanValue({ loan, structureId }))
        / 12
      );
    }

    getTheoreticalInterests({ loan, structureId }) {
      return (
        (this.selectLoanValue({ loan, structureId })
          * this.theoreticalInterestRate)
        / 12
      );
    }

    getTheoreticalMaintenance({ loan, structureId }) {
      return (
        (this.getPropAndWork({ loan, structureId })
          * this.theoreticalMaintenanceRate)
        / 12
      );
    }

    getAmortization({ loan, structureId, offerOverride }) {
      const offer = this.selectOffer({ loan, structureId });
      const loanValue = this.selectLoanValue({ loan, structureId });
      const offerToUse = offerOverride || offer;

      if (offerToUse) {
        // Temporarily change amortizationGoal
        const oldAmortizationGoal = this.amortizationGoal;
        this.amortizationGoal = offerToUse.amortizationGoal;

        const amortizationRate = this.getAmortizationRate({
          loan,
          amortizationYears: offerToUse.amortizationYears,
          structureId,
        });

        const amortization = (amortizationRate * loanValue) / 12;

        this.amortizationGoal = oldAmortizationGoal;

        return amortization;
      }

      const amortizationRate = this.getAmortizationRate({ loan, structureId });
      return (amortizationRate * loanValue) / 12;
    }

    getTheoreticalAmortization({ loan, structureId }) {
      const loanValue = this.selectLoanValue({ loan, structureId });

      return (this.getAmortizationRate({ loan, structureId }) * loanValue) / 12;
    }

    getAmortizationRate({ loan, amortizationYears, structureId }) {
      const borrowRatio = this.getBorrowRatio({ loan, structureId });
      return this.getAmortizationRateBase({
        borrowRatio,
        amortizationYears,
      });
    }

    getMonthly({ loan, interestRates, structureId }) {
      return (
        this.getInterests({ loan, interestRates, structureId })
        + this.getAmortization({ loan, structureId })
      );
    }

    getTheoreticalMonthly({ loan, structureId }) {
      const interests = this.getTheoreticalInterests({ loan, structureId });
      const amortization = this.getTheoreticalAmortization({
        loan,
        structureId,
      });
      const maintenance = this.getTheoreticalMaintenance({ loan, structureId });
      return interests + amortization + maintenance;
    }

    getIncomeRatio({ loan, structureId }) {
      const cost = this.getTheoreticalMonthly({ loan, structureId });
      const income = this.getTotalIncome({ borrowers: loan.borrowers });
      return cost / (income / 12);
    }

    getBorrowRatio({ loan, structureId }) {
      const wantedLoan = this.selectStructureKey({
        loan,
        structureId,
        key: 'wantedLoan',
      });
      const propertyValue = this.selectPropertyValue({ loan, structureId });
      const propertyWork = this.selectStructureKey({
        loan,
        structureId,
        key: 'propertyWork',
      }) || 0;
      return wantedLoan / (propertyValue + propertyWork);
    }

    getMaxBorrowRatio({ loan: { usageType } }) {
      return this.maxBorrowRatio;
    }

    loanHasMinimalInformation({ loan }) {
      const {
        structure: { ownFunds },
      } = loan;

      return !!(
        ownFunds
        && ownFunds.length > 0
        && this.selectPropertyValue({ loan })
        && this.selectLoanValue({ loan })
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

    getTotalFinancing({ loan, structureId }) {
      return (
        this.selectStructureKey({ loan, structureId, key: 'wantedLoan' })
        + this.getNonPledgedOwnFunds({ loan, structureId })
      );
    }

    getNonPledgedOwnFunds({ loan, structureId }) {
      const ownFunds = this.selectStructureKey({ loan, structureId, key: 'ownFunds' }) || [];
      return ownFunds
        .filter(({ usageType }) => usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
        .reduce((sum, { value }) => sum + value, 0);
    }

    getPledgedOwnFunds({ loan, structureId }) {
      const ownFunds = this.selectStructureKey({ loan, structureId, key: 'ownFunds' }) || [];
      return ownFunds
        .filter(({ usageType }) => usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE)
        .reduce((sum, { value }) => sum + value, 0);
    }

    getUsedFundsOfType({ loan, type, usageType, structureId }) {
      const ownFunds = this.selectStructureKey({ loan, structureId, key: 'ownFunds' }) || [];
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
      // Don't count extra third party fortune, as it is not a real "loan" from them
      return Object.values(OWN_FUNDS_TYPES)
        .filter(type => type !== OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE)
        .reduce(
          (sum, type) => sum + this.getRemainingFundsOfType({ loan, type }),
          0,
        );
    }

    refinancingPercent({ loan }) {
      const a = [];
      getCountedArray(getRefinancingFormArray({ loan }), loan, a);
      return getPercent(a);
    }

    getMortgageNoteIncrease({ loan, structureId }) {
      const { borrowers = [] } = loan;
      const { mortgageNoteIds = [] } = this.selectStructure({
        loan,
        structureId,
      });

      const { mortgageNotes: propertyMortgageNotes = [] } = this.selectProperty({ loan, structureId });
      const borrowerMortgageNotes = this.getMortgageNotes({ borrowers });
      const structureMortgageNotes = mortgageNoteIds.map(id =>
        borrowerMortgageNotes.find(({ _id }) => _id === id));

      const allMortgageNotes = [
        ...structureMortgageNotes,
        ...propertyMortgageNotes,
      ];
      const mortgageNoteValue = allMortgageNotes.reduce(
        (total, { value }) => total + (value || 0),
        0,
      );
      const loanValue = this.selectLoanValue({ loan, structureId });

      return Math.max(0, loanValue - mortgageNoteValue);
    }

    structureIsValid({ loan, structureId }) {
      const incomeRatio = this.getIncomeRatio({ loan, structureId });
      const borrowRatio = this.getBorrowRatio({ loan, structureId });

      if (
        incomeRatio > this.maxIncomeRatio
        || borrowRatio > this.maxBorrowRatio
      ) {
        return false;
      }

      if (
        !this.allowPledge
        && this.getPledgedOwnFunds({ loan, structureId }) > 0
      ) {
        return false;
      }

      return true;
    }

    getEstimatedMortgageRevenues({ loan, structureId }) {
      const loanValue = this.selectLoanValue({loan, structureId});
      return loanValue * this.mortgageCommission;
    }

    getEstimatedIndirectAmortizationRevenues({ loan, structureId }) {
      const loanValue = this.selectLoanValue({ loan, structureId });
      return loanValue * this.indirectAmortizationCommission;
    }

    getEstimatedRevenues({ loan, structureId }) {
      return (
        this.getEstimatedIndirectAmortizationRevenues({ loan, structureId })
        + this.getEstimatedMortgageRevenues({ loan, structureId })
      );
    }

    getEstimatedReferralRevenues({ loan, structureId }) {
      return (
        this.getEstimatedRevenues({ loan, structureId })
        * this.referralCommission
      );
    }
  };

export const LoanCalculator = withLoanCalculator(FinanceCalculator);

export default new LoanCalculator({});
