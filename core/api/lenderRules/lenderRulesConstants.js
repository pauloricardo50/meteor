export const LENDER_RULES_COLLECTION = 'lenderRules';

export const LENDER_RULES_QUERIES = {
  // Insert your queries name here
  // Example:
  // EXAMPLE_QUERIE: 'EXAMPLE_QUERIE',
};

export const INCOME_CONSIDERATION_TYPES = {
  GROSS: 'GROSS',
  NET: 'NET',
};

export const REAL_ESTATE_CONSIDERATION_TYPES = {
  ADD_TO_INCOME: 'ADD_TO_INCOME',
  SUBTRACT_FROM_EXPENSES: 'SUBTRACT_FROM_EXPENSES',
};

export const OTHER_EXPENSES_CONSIDERATION_TYPES = {
  SUBTRACT_FROM_INCOME: 'SUBTRACT_FROM_INCOME',
  ADD_TO_EXPENSES: 'ADD_TO_EXPENSES',
};

export const DEFAULT_VALUE_FOR_ALL = {
  incomeConsiderationType: INCOME_CONSIDERATION_TYPES.GROSS,
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
  otherExpensesConsiderationType:
    OTHER_EXPENSES_CONSIDERATION_TYPES.SUBTRACT_FROM_INCOME,
  theoreticalInterestRate: 0.05,
  theoreticalMaintenanceRate: 0.01,
  amortizationGoal: 0.65,
  amortizationYears: 15,
  maxBorrowRatio: 0.9,
  maxIncomeRatio: 0.3333,
};
