import { parseFilter } from 'core/api/lenderRules/helpers';
import { getMatchingRules } from '../../api/lenderRules/helpers';
import { LENDER_RULES_VARIABLES } from '../../api/constants';

// @flow

export const withLenderRulesInitializator = (SuperClass = class {}) =>
  class extends SuperClass {
    constructor(settings) {
      super(settings);
      this.initialize(settings);
    }

    initialize({ loan, structureId, lenderRules }) {
      if (!(loan && lenderRules)) {
        return;
      }

      const primaryRules = this.getPrimaryLenderRules({
        loan,
        structureId,
        lenderRules,
      });
      this.applyRules(primaryRules);

      const secondaryRules = this.getSecondaryLenderRules({
        loan,
        structureId,
        lenderRules,
      });
      this.applyRules(secondaryRules);
    }

    getLenderRulesVariables({ loan, structureId }) {
      return {
        [LENDER_RULES_VARIABLES.RESIDENCE_TYPE]: loan.residenceType,
        [LENDER_RULES_VARIABLES.CANTON]: this.makeSelectPropertyKey(LENDER_RULES_VARIABLES.CANTON)({ loan, structureId }),
        [LENDER_RULES_VARIABLES.WANTED_LOAN]: this.selectStructureKey({
          loan,
          structureId,
          key: LENDER_RULES_VARIABLES.WANTED_LOAN,
        }),
        [LENDER_RULES_VARIABLES.PROPERTY_VALUE]: this.selectPropertyValue({
          loan,
          structureId,
        }),
        [LENDER_RULES_VARIABLES.INSIDE_AREA]: this.makeSelectPropertyKey(LENDER_RULES_VARIABLES.INSIDE_AREA)({ loan, structureId }),
        [LENDER_RULES_VARIABLES.BANK_FORTUNE]: this.getFortune({ loan }),
        [LENDER_RULES_VARIABLES.BORROW_RATIO]: this.getBorrowRatio({
          loan,
          structureId,
        }),
        [LENDER_RULES_VARIABLES.INCOME]: this.getTotalIncome({ loan }),
      };
    }

    getPrimaryLenderRules({ loan, structureId, lenderRules }) {
      const primaryRules = lenderRules.filter(rules => !this.lenderRulesIsSecondary(rules));
      const matchingRules = getMatchingRules(
        primaryRules,
        this.getLenderRulesVariables({ loan, structureId }),
      );
      return matchingRules;
    }

    // Gets the secondary lender rules that require other lender rules to
    // already have been applied
    getSecondaryLenderRules({ loan, structureId, lenderRules }) {
      const secondaryRules = lenderRules.filter(this.lenderRulesIsSecondary);
      const matchingRules = getMatchingRules(
        secondaryRules,
        this.getLenderRulesVariables({ loan, structureId }),
      );
      return matchingRules;
    }

    lenderRulesIsSecondary({ filter }) {
      return filter.and
        .map(parseFilter)
        .some(({ variable }) =>
          [
            LENDER_RULES_VARIABLES.BORROW_RATIO,
            LENDER_RULES_VARIABLES.INCOME,
          ].includes(variable));
    }

    applyRules(rules) {
      const rulesToApply = [
        'allowPledge',
        'amortizationGoal',
        'amortizationYears',
        'bonusConsideration',
        'bonusHistoryToConsider',
        'companyIncomeHistoryToConsider',
        'dividendsConsideration',
        'dividendsHistoryToConsider',
        'fortuneReturnsRatio',
        'incomeConsiderationType',
        'investmentIncomeConsideration',
        'maxBorrowRatio',
        'maxIncomeRatio',
        'otherExpensesConsiderationType',
        'pensionIncomeConsideration',
        'realEstateIncomeConsideration',
        'realEstateIncomeConsiderationType',
        'theoreticalInterestRate',
        'theoreticalInterestRate2ndRank',
        'theoreticalMaintenanceRate',
      ];

      rulesToApply.forEach((rule) => {
        if (rules[rule]) {
          this[rule] = rules[rule];
        }
      });
    }
  };
