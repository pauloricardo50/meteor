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

    initialize({ loan, structureId, lenderRules = [] }) {
      if (!(loan && lenderRules && lenderRules.length > 0)) {
        return;
      }

      const sortedlenderRules = lenderRules.sort(({ order: orderA }, { order: orderB }) => orderA - orderB);

      // Store the rules for retrieval later
      this.lenderRules = sortedlenderRules;
      this.ruleOrigin = {};
      this.matchedRules = [];

      const primaryRules = this.getPrimaryLenderRules({
        loan,
        structureId,
        lenderRules: sortedlenderRules,
      });
      this.applyRules(primaryRules);

      const secondaryRules = this.getSecondaryLenderRules({
        loan,
        structureId,
        lenderRules: sortedlenderRules,
      });
      this.applyRules(secondaryRules);

      this.cleanUpUnusedRules();
    }

    storeRuleOrigin(rules, lenderRulesId) {
      Object.keys(rules).forEach((ruleName) => {
        this.ruleOrigin[ruleName] = lenderRulesId;
      });
    }

    getOriginOfRule(ruleName) {
      const lenderRulesId = this.ruleOrigin[ruleName];
      const lenderRules = this.lenderRules.find(({ _id }) => _id === lenderRulesId);
      return lenderRules;
    }

    getLenderRulesVariables({ loan, structureId }) {
      return {
        [LENDER_RULES_VARIABLES.RESIDENCE_TYPE]: loan.residenceType,
        [LENDER_RULES_VARIABLES.CANTON]: this.selectPropertyKey({
          loan,
          structureId,
          key: LENDER_RULES_VARIABLES.CANTON,
        }),
        [LENDER_RULES_VARIABLES.WANTED_LOAN]: this.selectStructureKey({
          loan,
          structureId,
          key: LENDER_RULES_VARIABLES.WANTED_LOAN,
        }),
        [LENDER_RULES_VARIABLES.PROPERTY_VALUE]: this.selectPropertyValue({
          loan,
          structureId,
        }),
        [LENDER_RULES_VARIABLES.INSIDE_AREA]: this.selectPropertyKey({
          loan,
          structureId,
          key: LENDER_RULES_VARIABLES.INSIDE_AREA,
        }),
        [LENDER_RULES_VARIABLES.BANK_FORTUNE]: this.getFortune({ loan }),
        [LENDER_RULES_VARIABLES.BORROW_RATIO]: this.getBorrowRatio({
          loan,
          structureId,
        }),
        [LENDER_RULES_VARIABLES.INCOME]: this.getTotalIncome({ loan }),
        [LENDER_RULES_VARIABLES.PROPERTY_TYPE]: this.selectPropertyKey({
          loan,
          structureId,
          key: LENDER_RULES_VARIABLES.PROPERTY_TYPE,
        }),
      };
    }

    getPrimaryLenderRules({ loan, structureId, lenderRules }) {
      const primaryRules = lenderRules.filter(rules => !this.lenderRulesIsSecondary(rules));
      const matchingRules = getMatchingRules(
        primaryRules,
        this.getLenderRulesVariables({ loan, structureId }),
        this.storeRuleOrigin,
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
        this.storeRuleOrigin,
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
      if (rules.names) {
        this.matchedRules = [
          ...this.matchedRules,
          ...rules.names.filter(x => x),
        ];
      }

      const rulesToApply = [
        'adminComments',
        'allowPledge',
        'amortizationGoal',
        'amortizationYears',
        'bonusConsideration',
        'bonusHistoryToConsider',
        'companyIncomeHistoryToConsider',
        'dividendsConsideration',
        'dividendsHistoryToConsider',
        'expensesSubtractFromIncome',
        'fortuneReturnsRatio',
        'incomeConsiderationType',
        'investmentIncomeConsideration',
        'maxBorrowRatio',
        'maxIncomeRatio',
        'pdfComments',
        'pensionIncomeConsideration',
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

    cleanUpUnusedRules() {
      this.maxIncomeRatioTight = 0;
      this.maxBorrowRatioWithPledge = 0;
    }
  };
