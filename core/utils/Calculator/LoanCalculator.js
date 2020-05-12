import moment from 'moment';

import { OWN_FUNDS_TYPES } from '../../api/borrowers/borrowerConstants';
import { ERROR, SUCCESS, WARNING } from '../../api/constants';
import { getLoanDocuments } from '../../api/files/documents';
import {
  filesPercent,
  getMissingDocumentIds,
  getRequiredDocumentIds,
} from '../../api/files/fileHelpers';
import {
  OWN_FUNDS_USAGE_TYPES,
  PURCHASE_TYPE,
} from '../../api/loans/loanConstants';
import { RESIDENCE_TYPE } from '../../api/properties/propertyConstants';
import { getPropertyArray } from '../../arrays/PropertyFormArray';
import getRefinancingFormArray from '../../arrays/RefinancingFormArray';
import {
  MAX_BORROW_RATIO_INVESTMENT_PROPERTY,
  MIN_INSURANCE2_WITHDRAW,
  REAL_ESTATE_INCOME_ALGORITHMS,
} from '../../config/financeConstants';
import {
  getCountedArray,
  getFormValuesHashMultiple,
} from '../formArrayHelpers';
import { getPercent } from '../general';
import NotaryFeesCalculator from '../notaryFees/NotaryFeesCalculator';

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

    getFees({ loan, structureId }) {
      const notaryFees = this.getNotaryFees({ loan, structureId });
      const reimbursementPenalty = this.selectReimbursementPenalty({
        loan,
        structureId,
      });

      return {
        total: notaryFees.total + reimbursementPenalty,
        notaryFees,
        reimbursementPenalty,
      };
    }

    getNotaryFees({ loan, structureId }) {
      const notaryFees = this.selectStructureKey({
        loan,
        structureId,
        key: 'notaryFees',
      });

      // Custom notary fees are provided
      if (notaryFees === 0 || notaryFees) {
        return { total: notaryFees };
      }

      const calculator = this.getNotaryFeesCalculator({ loan, structureId });

      const calculatedNotaryFees = calculator.getNotaryFeesForLoan({
        loan,
        structureId,
      });

      return calculatedNotaryFees;
    }

    getNotaryFeesCalculator({ loan, structureId }) {
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
      if (offer) {
        finalInterestRates = offer;
      }

      const interests = this.getInterestsWithTranches({
        tranches: loanTranches,
        interestRates: finalInterestRates,
      });

      return interests / 12;
    }

    getTheoreticalInterests({ loan, structureId }) {
      const loanValue = this.selectLoanValue({ loan, structureId });
      const propertyValue = this.selectPropertyValue({ loan, structureId });
      const propertyWork =
        this.selectStructureKey({
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
      const secondRankInterests =
        secondRank *
        (this.theoreticalInterestRate2ndRank || this.theoreticalInterestRate);

      return (firstRankInterests + secondRankInterests) / 12;
    }

    getTheoreticalMaintenance({ loan, structureId }) {
      return (
        (this.getPropAndWork({ loan, structureId }) *
          this.theoreticalMaintenanceRate) /
        12
      );
    }

    getAmortization({ loan, structureId, offerOverride }) {
      const loanValue = this.selectLoanValue({ loan, structureId });
      const yearlyAmortization = this.selectStructureKey({
        loan,
        structureId,
        key: 'yearlyAmortization',
      });
      const offer = this.selectOffer({ loan, structureId });
      const offerToUse = offerOverride || offer;

      if (yearlyAmortization >= 0) {
        return yearlyAmortization / 12;
      }

      if (offerToUse?.yearlyAmortization >= 0) {
        return offerToUse.yearlyAmortization / 12;
      }

      const amortizationYears = this.getAmortizationYears({
        loan,
        structureId,
        offerOverride,
      });
      const amortizationGoal = this.getAmortizationGoal({
        loan,
        structureId,
        offerOverride,
      });

      const amortizationRate = this.getAmortizationRate({
        loan,
        structureId,
        amortizationYears,
        amortizationGoal,
      });

      const amortization = (amortizationRate * loanValue) / 12;

      return amortization;
    }

    getAmortizationGoal({ loan, structureId, offerOverride }) {
      const offer = this.selectOffer({ loan, structureId });
      const offerToUse = offerOverride || offer;

      const firstRank = this.selectStructureKey({
        loan,
        structureId,
        key: 'firstRank',
      });

      if (firstRank >= 0) {
        return firstRank;
      }

      if (offerToUse) {
        return offerToUse.amortizationGoal;
      }

      return this.amortizationGoal;
    }

    getTheoreticalAmortization({ loan, structureId }) {
      const loanValue = this.selectLoanValue({ loan, structureId });

      return (
        (this.getAmortizationRate({
          loan,
          structureId,
          amortizationGoal: this.amortizationGoal,
        }) *
          loanValue) /
        12
      );
    }

    getAmortizationBorrowRatio({ loan, structureId }) {
      const borrowRatio = this.getBorrowRatio({ loan, structureId });
      const propAndWork = this.getPropAndWork({ loan, structureId });
      const ownFunds =
        this.selectStructureKey({ loan, structureId, key: 'ownFunds' }) || [];

      // These funds should not be amortized, as they are considered as the equivalent of using cash directly
      const cashPledgedFunds = ownFunds
        .filter(({ usageType }) => usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE)
        .filter(({ type }) => type !== OWN_FUNDS_TYPES.INSURANCE_2)
        .reduce((sum, { value }) => sum + value, 0);

      const adjustedBorrowRatio = borrowRatio - cashPledgedFunds / propAndWork;
      return adjustedBorrowRatio;
    }

    getAmortizationRate({
      loan,
      structureId,
      amortizationYears = this.getAmortizationYears({ loan, structureId }),
      amortizationGoal,
    }) {
      const borrowRatio = this.getBorrowRatio({ loan, structureId });
      const amortizationBorrowRatio = this.getAmortizationBorrowRatio({
        loan,
        structureId,
      });

      // Readjust borrowRatio in function of the gross loan value (with pledged cash), instead of
      // the net borrowRatio (without pledged cash)
      return (
        (this.getAmortizationRateBase({
          borrowRatio: amortizationBorrowRatio,
          amortizationYears,
          amortizationGoal,
        }) *
          amortizationBorrowRatio) /
        borrowRatio
      );
    }

    getTotalAmortization({ loan, structureId }) {
      const amortization = this.getAmortization({ loan, structureId });
      const amortizationYears = this.getAmortizationYears({
        loan,
        structureId,
      });
      return amortization * amortizationYears * 12;
    }

    getMonthly({ loan, interestRates, structureId }) {
      return (
        this.getInterests({ loan, interestRates, structureId }) +
        this.getAmortization({ loan, structureId })
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
      const expensesToAddToTheoreticalCost =
        this.getFormattedExpenses({ loan, structureId }).add / 12;

      return propertyCost + expensesToAddToTheoreticalCost;
    }

    getTheoreticalPropertySplit({ loan, structureId }) {
      const propertyCost = this.getTheoreticalPropertyCost({
        loan,
        structureId,
      });
      const propertyIncome =
        this.getYearlyPropertyIncome({
          loan,
          structureId,
        }) / 12;

      if (
        this.realEstateIncomeAlgorithm ===
        REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT
      ) {
        const delta = propertyIncome - propertyCost;

        if (delta >= 0) {
          return { addToIncome: delta, addToExpenses: 0 };
        }

        return { addToIncome: 0, addToExpenses: -delta };
      }

      return { addToIncome: propertyIncome, addToExpenses: propertyCost };
    }

    getMonthlyProjectIncome({ loan, structureId }) {
      const borrowerIncome = this.getTotalIncome({ loan });
      const { addToIncome } = this.getTheoreticalPropertySplit({
        loan,
        structureId,
      });
      return borrowerIncome / 12 + addToIncome;
    }

    getMonthlyProjectCost({ loan, structureId }) {
      const { addToExpenses } = this.getTheoreticalPropertySplit({
        loan,
        structureId,
      });
      return addToExpenses;
    }

    getIncomeRatio({ loan, structureId }) {
      const cost = this.getMonthlyProjectCost({ loan, structureId });
      const income = this.getMonthlyProjectIncome({ loan, structureId });
      const ratio = cost / income;

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

    getMaxBorrowRatio({ loan, structureId } = {}) {
      const offer = !!loan && this.selectOffer({ loan, structureId });

      if (offer) {
        const { maxAmount } = offer;
        const propertyValue = this.getPropAndWork({ loan, structureId });
        const maxBorrowRatio = propertyValue
          ? maxAmount / propertyValue
          : this.maxBorrowRatio;

        return Math.min(maxBorrowRatio, 1);
      }

      const { residenceType } = loan;

      if (residenceType === RESIDENCE_TYPE.INVESTMENT) {
        return Math.min(
          this.maxBorrowRatio,
          MAX_BORROW_RATIO_INVESTMENT_PROPERTY,
        );
      }

      return this.maxBorrowRatio;
    }

    loanHasMinimalInformation({ loan }) {
      const structure = this.selectStructure({ loan });
      const isRefinancing = loan.purchaseType === PURCHASE_TYPE.REFINANCING;

      if (isRefinancing) {
        return (
          this.selectPropertyValue({ loan }) && this.selectLoanValue({ loan })
        );
      }

      return !!(
        structure.ownFunds &&
        structure.ownFunds.length > 0 &&
        this.selectPropertyValue({ loan }) &&
        this.selectLoanValue({ loan })
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
        this.selectStructureKey({ loan, structureId, key: 'wantedLoan' }) +
        this.getNonPledgedOwnFunds({ loan, structureId })
      );
    }

    getNonPledgedOwnFunds({ loan, structureId }) {
      const ownFunds =
        this.selectStructureKey({ loan, structureId, key: 'ownFunds' }) || [];
      return ownFunds
        .filter(({ usageType }) => usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE)
        .reduce((sum, { value }) => sum + value, 0);
    }

    getPledgedOwnFunds({ loan, structureId }) {
      const ownFunds =
        this.selectStructureKey({ loan, structureId, key: 'ownFunds' }) || [];
      return ownFunds
        .filter(({ usageType }) => usageType === OWN_FUNDS_USAGE_TYPES.PLEDGE)
        .reduce((sum, { value }) => sum + value, 0);
    }

    getUsedFundsOfType({ loan, type, usageType, structureId }) {
      const ownFunds =
        this.selectStructureKey({ loan, structureId, key: 'ownFunds' }) || [];
      return ownFunds
        .filter(({ type: ownFundType }) => (type ? ownFundType === type : true))
        .filter(({ usageType: ownFundUsageType }) =>
          usageType ? ownFundUsageType === usageType : true,
        )
        .reduce((sum, { value }) => sum + value, 0);
    }

    getRemainingFundsOfType({ loan, structureId, type }) {
      const ownFunds = this.getFunds({ loan, type, structureId });
      return (
        ownFunds -
        this.getUsedFundsOfType({
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
      // Don't count extra  donations, as it is not a real "loan" from them
      return Object.values(OWN_FUNDS_TYPES)
        .filter(type => type !== OWN_FUNDS_TYPES.DONATION)
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

      const {
        mortgageNotes: propertyMortgageNotes = [],
      } = this.selectProperty({ loan, structureId });
      const borrowerMortgageNotes = this.getMortgageNotes({ borrowers });
      const structureMortgageNotes = mortgageNoteIds.map(id =>
        borrowerMortgageNotes.find(({ _id }) => _id === id),
      );

      const allMortgageNotes = [
        ...structureMortgageNotes,
        ...propertyMortgageNotes,
      ];
      const mortgageNoteValue = allMortgageNotes.reduce(
        (total, { value }) => total + (value || 0),
        0,
      );
      const loanValue = this.selectLoanValue({ loan, structureId });
      const wantedMortgageNote = this.selectStructureKey({
        loan,
        structureId,
        key: 'wantedMortgageNote',
      });

      return (
        Math.max(0, (wantedMortgageNote || loanValue) - mortgageNoteValue) || 0
      );
    }

    getCashUsed({ loan, structureId }) {
      const { ownFunds } = this.selectStructure({ loan, structureId });

      return ownFunds
        .filter(
          ({ type, usageType }) =>
            type !== OWN_FUNDS_TYPES.INSURANCE_2 &&
            usageType !== OWN_FUNDS_USAGE_TYPES.PLEDGE,
        )
        .reduce((sum, { value }) => sum + value, 0);
    }

    getCashRatio({ loan, structureId }) {
      const propAndWork = this.getPropAndWork({ loan, structureId });
      const fees = this.getFees({ loan, structureId }).total;
      const cashUsed = this.getCashUsed({ loan, structureId });

      const cashRatio = (cashUsed - fees) / propAndWork;
      return cashRatio;
    }

    getInsurance2Ratio({ loan, structureId }) {
      const propAndWork = this.getPropAndWork({ loan, structureId });
      const insurance2Used = this.getUsedFundsOfType({
        loan,
        type: OWN_FUNDS_TYPES.INSURANCE_2,
        structureId,
      });

      const insurance2Ratio = insurance2Used / propAndWork;
      return insurance2Ratio;
    }

    getInsurance2WithdrawRatio({ loan, structureId }) {
      const propAndWork = this.getPropAndWork({ loan, structureId });
      const insurance2Used = this.getUsedFundsOfType({
        loan,
        type: OWN_FUNDS_TYPES.INSURANCE_2,
        structureId,
        usageType: OWN_FUNDS_USAGE_TYPES.WITHDRAW,
      });

      return insurance2Used / propAndWork;
    }

    hasEnoughCash({ loan, structureId }) {
      const isRefinancing = loan.purchaseType === PURCHASE_TYPE.REFINANCING;

      if (isRefinancing) {
        return true;
      }

      return this.getCashRatio({ loan, structureId }) >= this.minCash;
    }

    structureIsValid({ loan, structureId }) {
      const incomeRatio = this.getIncomeRatio({ loan, structureId });
      const borrowRatio = this.getBorrowRatio({ loan, structureId });
      const withdrawInsurance2 = this.selectStructureKey({
        loan,
        structureId,
        key: 'ownFunds',
      }).filter(
        ({ type, usageType }) =>
          type === OWN_FUNDS_TYPES.INSURANCE_2 &&
          usageType === OWN_FUNDS_USAGE_TYPES.WITHDRAW,
      );

      if (
        incomeRatio > this.maxIncomeRatio ||
        borrowRatio > this.maxBorrowRatio
      ) {
        return false;
      }

      if (
        !this.allowPledge &&
        this.getPledgedOwnFunds({ loan, structureId }) > 0
      ) {
        return false;
      }

      if (
        withdrawInsurance2.some(({ value }) => value < MIN_INSURANCE2_WITHDRAW)
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
        this.getEstimatedRevenues({ loan, structureId }) *
        this.referralCommission
      );
    }

    getRequiredOwnFunds({ loan, structureId }) {
      const isRefinancing = loan.purchaseType === PURCHASE_TYPE.REFINANCING;

      if (isRefinancing) {
        const refinancingRequiredOwnFunds = this.getRefinancingRequiredOwnFunds(
          {
            loan,
            structureId,
          },
        );
        return Math.max(refinancingRequiredOwnFunds, 0);
      }

      const loanValue = this.selectLoanValue({ loan, structureId });
      const projectValue = this.getProjectValue({ loan, structureId });

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
          !this.isMissingOwnFunds({ loan, structureId: id }) &&
          !this.hasTooMuchOwnFunds({ loan, structureId: id })
        ) {
          return true;
        }

        return false;
      });
    }

    getRequiredPledgedOwnFunds({ loan, structureId }) {
      const { maxBorrowRatio } = this;
      const borrowRatio = this.getBorrowRatio({ loan, structureId });

      if (borrowRatio <= maxBorrowRatio) {
        return 0;
      }

      return (
        (borrowRatio - maxBorrowRatio) *
        this.getPropAndWork({ loan, structureId })
      );
    }

    getLoanFromBorrowRatio({ loan, structureId }) {
      const borrowRatio = this.getBorrowRatio({ loan, structureId });
      return borrowRatio * this.getPropAndWork({ loan, structureId });
    }

    getLoanFromMaxBorrowRatio({ loan, structureId }) {
      const maxBorrowRatio = this.getMaxBorrowRatio({ loan, structureId });
      return maxBorrowRatio * this.getPropAndWork({ loan, structureId });
    }

    getBorrowRatioStatusTooltip({
      loan,
      structureId,
      status,
      maxBorrowRatio,
      requiredPledgedOwnFunds,
      currentPledgedOwnFunds,
    }) {
      const values = {
        requiredPledgedOwnFunds,
        wantedLoan: this.getLoanFromBorrowRatio({ loan, structureId }),
        currentPledgedOwnFunds,
        maxBorrowRatio,
        maxLoan: this.getLoanFromMaxBorrowRatio({ loan, structureId }),
      };
      let id;
      switch (status) {
        case SUCCESS:
          id = 'StatusIconTooltip.borrowRatio.SUCCESS';
          break;
        case WARNING:
          if (this.lenderRules && this.lenderRules.length) {
            id = 'StatusIconTooltip.borrowRatio.WARNING.withLenderRules';
            break;
          }

          id = 'StatusIconTooltip.borrowRatio.WARNING';
          break;

        case ERROR:
          id = 'StatusIconTooltip.borrowRatio.ERROR';
          break;

        default:
          break;
      }

      return { id, values };
    }

    getBorrowRatioStatus({ loan, structureId }) {
      const currentPledgedOwnFunds = this.getPledgedOwnFunds({
        loan,
        structureId,
      });
      const requiredPledgedOwnFunds = this.getRequiredPledgedOwnFunds({
        loan,
        structureId,
      });

      const {
        maxBorrowRatio: defaultMaxBorrowRatio,
        maxBorrowRatioWithPledge,
      } = this;
      const borrowRatio = this.getBorrowRatio({ loan, structureId });
      const maxBorrowRatio = this.getMaxBorrowRatio({ loan, structureId });

      if (this.selectOffer({ loan, structureId })) {
        if (maxBorrowRatio <= defaultMaxBorrowRatio) {
          const status = borrowRatio <= maxBorrowRatio ? SUCCESS : ERROR;
          return {
            status,
            tooltip: this.getBorrowRatioStatusTooltip({
              status,
              loan,
              structureId,
              maxBorrowRatio,
              currentPledgedOwnFunds,
            }),
          };
        }

        if (currentPledgedOwnFunds >= requiredPledgedOwnFunds) {
          const status = borrowRatio <= maxBorrowRatio ? SUCCESS : ERROR;
          return {
            status,
            tooltip: this.getBorrowRatioStatusTooltip({
              status,
              loan,
              structureId,
              maxBorrowRatio,
              currentPledgedOwnFunds,
            }),
          };
        }

        const status =
          borrowRatio <= defaultMaxBorrowRatio
            ? SUCCESS
            : borrowRatio <= maxBorrowRatio
            ? WARNING
            : ERROR;

        return {
          status,
          tooltip: this.getBorrowRatioStatusTooltip({
            status,
            loan,
            structureId,
            maxBorrowRatio,
            requiredPledgedOwnFunds,
            currentPledgedOwnFunds,
          }),
        };
      }

      if (currentPledgedOwnFunds >= requiredPledgedOwnFunds) {
        const status =
          borrowRatio <= maxBorrowRatioWithPledge ? SUCCESS : ERROR;

        return {
          status,
          tooltip: this.getBorrowRatioStatusTooltip({
            status,
            loan,
            structureId,
            maxBorrowRatio,
            currentPledgedOwnFunds,
          }),
        };
      }

      const status =
        borrowRatio <= maxBorrowRatio
          ? SUCCESS
          : borrowRatio <= maxBorrowRatioWithPledge
          ? WARNING
          : ERROR;

      return {
        status,
        tooltip: this.getBorrowRatioStatusTooltip({
          status,
          loan,
          structureId,
          maxBorrowRatio: maxBorrowRatioWithPledge,
          requiredPledgedOwnFunds,
          currentPledgedOwnFunds,
        }),
      };
    }

    getBorrowersValidFieldsRatio({ loan }) {
      const { borrowers = [] } = loan;
      return this.getValidBorrowerFieldsRatio({
        borrowers,
      });
    }

    getPropertyValidFieldsRatio({ loan, property }) {
      const { hasPromotion, properties = [] } = loan;

      if (
        !this.isUserProperty({ loan, property }) ||
        hasPromotion ||
        properties.length === 0
      ) {
        return null;
      }

      return this.getValidPropertyFieldsRatio({
        loan,
        property,
      });
    }

    getBorrowersValidDocumentsRatio({ loan }) {
      const { borrowers = [] } = loan;

      return this.getValidBorrowerDocumentsRatio({
        loan,
        borrowers,
      });
    }

    getLoanValidDocumentsRatio({ loan }) {
      const requiredDocuments = this.getRequiredLoanDocumentIds({
        loan,
      });
      const missingDocuments = this.getMissingLoanDocuments({ loan });

      return {
        valid: requiredDocuments.length - missingDocuments.length,
        required: requiredDocuments.length,
      };
    }

    getRequiredLoanDocumentIds({ loan }) {
      return getRequiredDocumentIds(getLoanDocuments({ loan }, this));
    }

    getPropertyValidDocumentsRatio({ loan, property }) {
      const { hasPromotion, properties = [] } = loan;

      if (
        !this.isUserProperty({ loan, property }) ||
        hasPromotion ||
        properties.length === 0
      ) {
        return null;
      }

      return this.getValidPropertyDocumentsRatio({ loan, property });
    }

    getValidFieldsRatio({ loan }) {
      return [
        this.getBorrowersValidFieldsRatio({ loan }),
        this.getPropertyValidFieldsRatio({ loan }),
      ]
        .filter(x => x)
        .reduce(
          (ratio, { valid, required }) => ({
            valid: ratio.valid + valid,
            required: ratio.required + required,
          }),
          { valid: 0, required: 0 },
        );
    }

    getValidDocumentsRatio({ loan }) {
      return [
        this.getBorrowersValidDocumentsRatio({ loan }),
        this.getPropertyValidDocumentsRatio({ loan }),
      ]
        .filter(x => x)
        .reduce(
          (ratio, { valid, required }) => ({
            valid: ratio.valid + valid,
            required: ratio.required + required,
          }),
          { valid: 0, required: 0 },
        );
    }

    getOwnFundsRatio({ loan, structureId }) {
      const fees = this.getFees({ loan, structureId }).total;
      const requiredOwnFunds =
        this.getRequiredOwnFunds({ loan, structureId }) - fees;
      const totalUsed = this.getNonPledgedOwnFunds({ loan, structureId });

      if (totalUsed <= 0) {
        return 0;
      }

      if (totalUsed > requiredOwnFunds) {
        return requiredOwnFunds / this.getPropAndWork({ loan, structureId });
      }

      return totalUsed / this.getPropAndWork({ loan, structureId });
    }

    getNotaryFeesTooltipValue({ loan, structureId }) {
      const fees = this.getNotaryFees({ loan, structureId }).total;
      const requiredOwnFunds =
        this.getRequiredOwnFunds({ loan, structureId }) - fees;
      const totalUsed = this.getNonPledgedOwnFunds({ loan, structureId });

      if (totalUsed <= requiredOwnFunds) {
        return null;
      }

      if (fees >= totalUsed - requiredOwnFunds) {
        return totalUsed - requiredOwnFunds;
      }

      return fees;
    }

    getPreviousLoanValue({ loan: { previousLoanTranches = [] } }) {
      return previousLoanTranches.reduce(
        (total, { value = 0 }) => total + value,
        0,
      );
    }

    getPreviousOwnFunds({ loan, structureId }) {
      const propertyValue = this.selectPropertyValue({ loan, structureId });
      const previousLoanValue = this.getPreviousLoanValue({ loan });
      return propertyValue - previousLoanValue;
    }

    getReimbursementPenalty({
      loan,
      structureId,
      refinancingDate = this.selectStructureKey({
        loan,
        structureId,
        key: 'refinancingDate',
      }),
    }) {
      const { previousLoanTranches = [] } = loan;

      if (!refinancingDate) {
        return 0;
      }

      return previousLoanTranches
        .filter(({ dueDate }) =>
          moment(dueDate).isAfter(moment(refinancingDate)),
        )
        .reduce((total, { value = 0, rate = 0, dueDate }) => {
          const remainingYears =
            moment(dueDate).diff(moment(refinancingDate), 'months') / 12;

          return total + remainingYears * value * rate;
        }, 0);
    }

    selectReimbursementPenalty({ loan, structureId }) {
      if (loan.purchaseType !== PURCHASE_TYPE.REFINANCING) {
        return 0;
      }

      const reimbursementPenalty = this.selectStructureKey({
        loan,
        structureId,
        key: 'reimbursementPenalty',
      });

      if (!(reimbursementPenalty === 0 || reimbursementPenalty)) {
        return this.getReimbursementPenalty({
          loan,
          structureId,
        });
      }

      return reimbursementPenalty;
    }

    getLoanEvolution({ loan, structureId }) {
      const wantedLoan = this.selectStructureKey({
        loan,
        structureId,
        key: 'wantedLoan',
      });

      return wantedLoan - this.getPreviousLoanValue({ loan });
    }

    getRefinancingRequiredOwnFunds({ loan, structureId }) {
      const fees = this.getFees({ loan, structureId }).total;
      const loanEvolution = this.getLoanEvolution({ loan, structureId });

      return fees - loanEvolution;
    }

    getRefinancingHash({ loan }) {
      const property = this.selectProperty({ loan });

      const borrowerFormArray = this.getBorrowerFormArraysForHash({ loan });

      const propertyFormArray = {
        formArray: getPropertyArray({ loan, property }),
        doc: property,
      };

      const loanFormArray = {
        formArray: getRefinancingFormArray(),
        doc: loan,
      };

      return getFormValuesHashMultiple([
        ...borrowerFormArray,
        propertyFormArray,
        loanFormArray,
      ]);
    }

    getMaxPropertyValueHash({ loan }) {
      const { purchaseType } = loan;

      if (purchaseType === PURCHASE_TYPE.ACQUISITION) {
        return this.getBorrowerFormHash({ loan });
      }

      if (purchaseType === PURCHASE_TYPE.REFINANCING) {
        return this.getRefinancingHash({ loan });
      }
    }

    canCalculateSolvency({ loan, borrowers }) {
      const isRefinancing = loan.purchaseType === PURCHASE_TYPE.REFINANCING;
      if (!borrowers.length) {
        return false;
      }

      const bankFortune = this.getFortune({ borrowers });
      if (!bankFortune && !isRefinancing) {
        return false;
      }

      const salary = this.getSalary({ borrowers });
      if (!salary || salary === 0) {
        return false;
      }

      if (isRefinancing) {
        const property = this.selectProperty({ loan });

        if (!property?.value) {
          return false;
        }

        if (!property?.canton) {
          return false;
        }
      }

      return true;
    }
  };
