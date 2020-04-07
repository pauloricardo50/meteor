import { OWN_FUNDS_TYPES } from '../../api/borrowers/borrowerConstants';
import { getMatchingRules, parseFilter } from '../../api/lenderRules/helpers';
import { LENDER_RULES_VARIABLES } from '../../api/lenderRules/lenderRulesConstants';

//

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

      const sortedlenderRules = lenderRules.sort(
        ({ order: orderA }, { order: orderB }) => orderA - orderB,
      );

      // Store the rules for retrieval later
      this.lenderRules = sortedlenderRules;
      this.setOrganisationName(sortedlenderRules);
      this.ruleOrigin = {};
      this.matchedRules = [];

      // Global rules
      const globalRules = this.getGlobalLenderRules({
        loan,
        structureId,
        lenderRules: sortedlenderRules,
      });
      this.applyRules(globalRules);

      // Primary rules depend only on raw data
      const primaryRules = this.getPrimaryLenderRules({
        loan,
        structureId,
        lenderRules: sortedlenderRules,
      });
      this.applyRules(primaryRules);

      // Secondary rules depend on what is calculated with the rules applied from the primary rules
      const secondaryRules = this.getSecondaryLenderRules({
        loan,
        structureId,
        lenderRules: sortedlenderRules,
      });
      this.applyRules(secondaryRules);

      this.cleanUpUnusedRules();
    }

    setOrganisationName = lenderRules => {
      this.organisationName = lenderRules.length
        ? lenderRules[0].organisation && lenderRules[0].organisation.name
        : null;
    };

    storeRuleOrigin(rules, lenderRulesId) {
      Object.keys(rules).forEach(ruleName => {
        this.ruleOrigin[ruleName] = lenderRulesId;
      });
    }

    getOriginOfRule(ruleName) {
      const lenderRulesId = this.ruleOrigin[ruleName];
      const lenderRules = this.lenderRules.find(
        ({ _id }) => _id === lenderRulesId,
      );
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
        [LENDER_RULES_VARIABLES.ZIP_CODE]: this.selectPropertyKey({
          loan,
          structureId,
          key: LENDER_RULES_VARIABLES.ZIP_CODE,
        }),
        [LENDER_RULES_VARIABLES.REMAINING_BANK_FORTUNE]: this.getRemainingFundsOfType(
          {
            loan,
            structureId,
            type: OWN_FUNDS_TYPES.BANK_FORTUNE,
          },
        ),
        [LENDER_RULES_VARIABLES.IS_NEW_PROPERTY]: this.isNewProperty({
          loan,
          structureId,
        }),
      };
    }

    getGlobalLenderRules({ lenderRules }) {
      const globalRules = lenderRules.filter(
        ({ filter }) =>
          filter.and && filter.and.length === 1 && filter.and[0] === true,
      );
      const matchingRules = getMatchingRules(
        globalRules,
        {},
        this.storeRuleOrigin,
      );
      return matchingRules;
    }

    getPrimaryLenderRules({ loan, structureId, lenderRules }) {
      const primaryRules = lenderRules.filter(
        rules => !this.lenderRulesIsSecondary(rules),
      );
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
          ].includes(variable),
        );
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
        'bonusAlgorithm',
        'bonusConsideration',
        'bonusHistoryToConsider',
        'companyIncomeConsideration',
        'companyIncomeHistoryToConsider',
        'dividendsConsideration',
        'dividendsHistoryToConsider',
        'expensesSubtractFromIncome',
        'fortuneReturnsRatio',
        'incomeConsiderationType',
        'investmentIncomeConsideration',
        'maxBorrowRatio',
        'maxBorrowRatioWithPledge',
        'maxIncomeRatio',
        'pdfComments',
        'pensionIncomeConsideration',
        'realEstateIncomeAlgorithm',
        'realEstateIncomeConsideration',
        'realEstateIncomeConsiderationType',
        'theoreticalInterestRate',
        'theoreticalInterestRate2ndRank',
        'theoreticalMaintenanceRate',
      ];

      rulesToApply.forEach(rule => {
        if (rules[rule] !== undefined && rules[rule] !== null) {
          this[rule] = rules[rule];
        }
      });
    }

    cleanUpUnusedRules() {
      this.maxIncomeRatioTight = 0;
    }
  };
