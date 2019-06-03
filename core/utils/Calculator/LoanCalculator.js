// @flow
import { OWN_FUNDS_TYPES } from 'core/api/constants';
import { getLoanDocuments } from '../../api/files/documents';
import { OWN_FUNDS_USAGE_TYPES } from '../../api/constants';
import {
  filesPercent,
  getMissingDocumentIds,
} from '../../api/files/fileHelpers';
import getRefinancingFormArray from '../../arrays/RefinancingFormArray';
import NotaryFeesCalculator from '../notaryFees/NotaryFeesCalculator';
import { getCountedArray } from '../formArrayHelpers';
import { getPercent } from '../general';

export const withLoanCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    getProjectValue({ loan, structureId }) {
      const propAndWork = this.getPropAndWork({ loan, structureId });
      if (!propAndWork) {
        return 0;
      }

      const value = propAndWork + this.getFees({ loan, structureId }).total;

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

      const calculator = this.getFeesCalculator({ loan, structureId });

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
      const loanTranches = this.selectStructureKey({
        loan,
        key: 'loanTranches',
        structureId,
      });
      const loanValue = this.selectLoanValue({ loan, structureId });
      if (offer) {
        finalInterestRates = offer;
      }

      const interests = this.getInterestsWithTranches({
        tranches: loanTranches,
        interestRates: finalInterestRates,
      });

      return (interests * loanValue) / 12;
    }

    getTheoreticalInterests({ loan, structureId }) {
      const loanValue = this.selectLoanValue({ loan, structureId });
      const propertyValue = this.selectPropertyValue({ loan, structureId });
      const propertyWork = this.selectStructureKey({
        loan,
        structureId,
        key: 'propertyWork',
      }) || 0;
      const firstRank = Math.min(
        loanValue,
        this.amortizationGoal * (propertyValue + propertyWork),
      );
      const secondRank = Math.max(0, loanValue - firstRank);

      const firstRankInterests = firstRank * this.theoreticalInterestRate;
      const secondRankInterests = secondRank
        * (this.theoreticalInterestRate2ndRank || this.theoreticalInterestRate);

      return (firstRankInterests + secondRankInterests) / 12;
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
        // Prevent caching of this function if amortizationGoal has changed
        cacheFix: this.amortizationGoal,
      });
    }

    getMonthly({ loan, interestRates, structureId }) {
      return (
        this.getInterests({ loan, interestRates, structureId })
        + this.getAmortization({ loan, structureId })
      );
    }

    getTheoreticalPropertyCost({ loan, structureId, asObject = false }) {
      const interests = this.getTheoreticalInterests({ loan, structureId });
      const amortization = this.getTheoreticalAmortization({
        loan,
        structureId,
      });
      const maintenance = this.getTheoreticalMaintenance({ loan, structureId });
      return asObject
        ? {
          interests,
          amortization,
          maintenance,
          total: interests + amortization + maintenance,
        }
        : interests + amortization + maintenance;
    }

    getTheoreticalMonthly({ loan, structureId }) {
      const propertyCost = this.getTheoreticalPropertyCost({
        loan,
        structureId,
      });
      const expensesToAddToTheoreticalCost = this.getFormattedExpenses({ loan, structureId }).add / 12;

      return propertyCost + expensesToAddToTheoreticalCost;
    }

    getIncomeRatio({ loan, structureId }) {
      const cost = this.getTheoreticalMonthly({ loan, structureId });
      const income = this.getTotalIncome({ borrowers: loan.borrowers });
      const ratio = cost / (income / 12);

      if (ratio > 1 || ratio < 0) {
        return 1;
      }

      return ratio;
    }

    getBorrowRatio({ loan, structureId }) {
      const wantedLoan = this.selectStructureKey({
        loan,
        structureId,
        key: 'wantedLoan',
      });
      const propAndWork = this.getPropAndWork({ loan, structureId });
      return wantedLoan / propAndWork;
    }

    getMaxBorrowRatio() {
      return this.maxBorrowRatio;
    }

    loanHasMinimalInformation({ loan }) {
      const structure = this.selectStructure({ loan });

      return !!(
        structure.ownFunds
        && structure.ownFunds.length > 0
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

    getRemainingFundsOfType({ loan, structureId, type }) {
      const ownFunds = this.getFunds({ loan, type, structureId });
      return (
        ownFunds
        - this.getUsedFundsOfType({
          loan,
          type,
          structureId,
          usageType:
            type !== OWN_FUNDS_TYPES.BANK_FORTUNE
              ? OWN_FUNDS_USAGE_TYPES.WITHDRAW
              : undefined,
        })
      );
    }

    getTotalRemainingFunds({ loan, structureId }) {
      // Don't count extra third party fortune, as it is not a real "loan" from them
      return Object.values(OWN_FUNDS_TYPES)
        .filter(type => type !== OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE)
        .reduce(
          (sum, type) =>
            sum + this.getRemainingFundsOfType({ loan, structureId, type }),
          0,
        );
    }

    refinancingPercent({ loan }) {
      const array = getCountedArray(getRefinancingFormArray({ loan }), loan);
      return getPercent(array);
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

    getCashUsed({ loan, structureId }) {
      const { ownFunds } = this.selectStructure({ loan, structureId });

      return ownFunds
        .filter(({ type, usageType }) =>
          type !== OWN_FUNDS_TYPES.INSURANCE_2
            && usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
        .reduce((sum, { value }) => sum + value, 0);
    }

    getCashRatio({ loan, structureId }) {
      const propAndWork = this.getPropAndWork({ loan, structureId });
      const fees = this.getFees({ loan, structureId }).total;
      const cashUsed = this.getCashUsed({ loan, structureId });

      const cashRatio = (cashUsed - fees) / propAndWork;
      return cashRatio;
    }

    hasEnoughCash({ loan, structureId }) {
      return this.getCashRatio({ loan, structureId }) >= this.minCash;
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

    getEstimatedRevenues({ loan, structureId }) {
      const propertyValue = this.selectPropertyValue({ loan, structureId });
      return propertyValue * this.estimatedCommission;
    }

    getEstimatedReferralRevenues({ loan, structureId }) {
      return (
        this.getEstimatedRevenues({ loan, structureId })
        * this.referralCommission
      );
    }

    getRequiredOwnFunds({ loan, structureId }) {
      const projectValue = this.getProjectValue({ loan, structureId });
      const loanValue = this.selectLoanValue({ loan, structureId });
      return projectValue - loanValue;
    }

    getMissingOwnFunds({ loan, structureId }) {
      const fundsRequired = this.getRequiredOwnFunds({ loan, structureId });
      const totalCurrentFunds = this.getNonPledgedOwnFunds({
        loan,
        structureId,
      });

      return fundsRequired - totalCurrentFunds;
    }

    isMissingOwnFunds({ loan, structureId }) {
      const missingOwnFunds = this.getMissingOwnFunds({ loan, structureId });
      return missingOwnFunds >= this.ownFundsRoundingAmount;
    }

    hasTooMuchOwnFunds({ loan, structureId }) {
      const missingOwnFunds = this.getMissingOwnFunds({ loan, structureId });
      return missingOwnFunds <= -this.ownFundsRoundingAmount;
    }

    hasCompleteStructure({ loan }) {
      return loan.structures.some(({ id }) => {
        const fundsRequired = this.getRequiredOwnFunds({
          loan,
          structureId: id,
        });

        if (fundsRequired === 0) {
          return false;
        }

        if (
          !this.isMissingOwnFunds({ loan, structureId: id })
          && !this.hasTooMuchOwnFunds({ loan, structureId: id })
        ) {
          return true;
        }

        return false;
      });
    }
  };
