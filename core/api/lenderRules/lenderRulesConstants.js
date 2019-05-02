import { BONUS_ALGORITHMS } from 'core/config/financeConstants';
import { RESIDENCE_TYPE } from '../properties/propertyConstants';
import { EXPENSES } from '../borrowers/borrowerConstants';

export const LENDER_RULES_COLLECTION = 'lenderRules';

export const LENDER_RULES_QUERIES = {
  ORGANISATION_LENDER_RULES: 'ORGANISATION_LENDER_RULES',
};

export const INCOME_CONSIDERATION_TYPES = {
  GROSS: 'GROSS',
  NET: 'NET',
};

export const REAL_ESTATE_CONSIDERATION_TYPES = {
  ADD_TO_INCOME: 'ADD_TO_INCOME',
  SUBTRACT_FROM_EXPENSES: 'SUBTRACT_FROM_EXPENSES',
};

export const EXPENSES_CONSIDERATION_TYPES = {
  SUBTRACT_FROM_INCOME: 'SUBTRACT_FROM_INCOME',
  ADD_TO_EXPENSES: 'ADD_TO_EXPENSES',
};

export const LENDER_RULES_VARIABLES = {
  INCOME: 'income',
  RESIDENCE_TYPE: 'residenceType',
  CANTON: 'canton',
  BORROW_RATIO: 'borrowRatio',
  WANTED_LOAN: 'wantedLoan',
  PROPERTY_VALUE: 'propertyValue',
  INSIDE_AREA: 'insideArea',
  BANK_FORTUNE: 'bankFortune',
  PROPERTY_TYPE: 'propertyType',
  ZIP_CODE: 'zipCode',
  REMAINING_BANK_FORTUNE: 'remainingBankFortune',
};

export const LENDER_RULES_OPERATORS = {
  EQUALS: '===',
  MORE_THAN: '>',
  MORE_THAN_OR_EQUAL: '>=',
  LESS_THAN: '<',
  LESS_THAN_OR_EQUAL: '<=',
  IN: 'in',
};

export const DEFAULT_MAIN_RESIDENCE_RULES = [
  {
    [LENDER_RULES_OPERATORS.IN]: [
      { var: 'residenceType' },
      [RESIDENCE_TYPE.MAIN_RESIDENCE],
    ],
  },
];

export const DEFAULT_SECONDARY_RESIDENCE_RULES = [
  {
    [LENDER_RULES_OPERATORS.IN]: [
      { var: 'residenceType' },
      [RESIDENCE_TYPE.SECOND_RESIDENCE],
    ],
  },
];

// Keep the deltas above other expenses so they appear in the right order
export const EXPENSE_TYPES = {
  REAL_ESTATE_DELTA_POSITIVE: 'REAL_ESTATE_DELTA_POSITIVE',
  REAL_ESTATE_DELTA_NEGATIVE: 'REAL_ESTATE_DELTA_NEGATIVE',
  ...EXPENSES,
  THEORETICAL_REAL_ESTATE: 'THEORETICAL_REAL_ESTATE',
};

export const EXPENSE_TYPES_WITHOUT_DELTAS = Object.values(EXPENSE_TYPES).filter(value =>
  ![
    EXPENSE_TYPES.REAL_ESTATE_DELTA_POSITIVE,
    EXPENSE_TYPES.REAL_ESTATE_DELTA_NEGATIVE,
  ].includes(value));

export const DEFAULT_VALUE_FOR_ALL = {
  incomeConsiderationType: INCOME_CONSIDERATION_TYPES.GROSS,
  bonusAlgorithm: BONUS_ALGORITHMS.WEAK_AVERAGE,
  bonusConsideration: 0.5,
  bonusHistoryToConsider: 3,
  companyIncomeConsideration: 1,
  companyIncomeHistoryToConsider: 3,
  dividendsConsideration: 1,
  dividendsHistoryToConsider: 1,
  pensionIncomeConsideration: 1,
  realEstateIncomeConsideration: 1,
  realEstateIncomeConsiderationType:
    REAL_ESTATE_CONSIDERATION_TYPES.SUBTRACT_FROM_EXPENSES,
  investmentIncomeConsideration: 1,
  expensesSubtractFromIncome: EXPENSE_TYPES_WITHOUT_DELTAS,
  theoreticalInterestRate: 0.05,
  theoreticalMaintenanceRate: 0.01,
  amortizationGoal: 0.65,
  amortizationYears: 15,
  maxBorrowRatio: 0.9,
  maxIncomeRatio: 0.3333,
  allowPledge: true,
};
