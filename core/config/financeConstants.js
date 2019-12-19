export const NOTARY_FEES = 0.05; // Percent
export const AMORTIZATION_STOP = 0.65; // Percent
export const MAINTENANCE_REAL = 0.005; // Percent
export const MAINTENANCE_FINMA = 0.01; // Percent
export const INTERESTS_FINMA = 0.05; // Percent
export const APPROXIMATE_LPP_FEES = 0.1; // Percent
export const DEFAULT_AMORTIZATION = 0.01; // Percent of property value
export const AMORTIZATION_YEARS = 15; // Years
export const AMORTIZATION_YEARS_INVESTMENT = 10; // Years
export const DEFAULT_INTEREST_RATE = 0.015; // Percent, use 1.5% by default
export const MAX_BORROW_RATIO_PRIMARY_PROPERTY = 0.8; // Percent
export const MAX_BORROW_RATIO_INVESTMENT_PROPERTY = 0.75; // Percent
export const MAX_BORROW_RATIO_OTHER = 0.7; // Percent
export const MAX_BORROW_RATIO_WITH_PLEDGE = 0.9; // Percent
export const MAX_INCOME_RATIO = 1 / 3; // Percent
export const MAX_INCOME_RATIO_TIGHT = 0.38; // Percent
export const FORTUNE_WARNING_TIGHT = 'FORTUNE_WARNING_TIGHT';
export const INCOME_WARNING_TIGHT = 'INCOME_WARNING_TIGHT';
export const FORTUNE_ERROR = 'FORTUNE_ERROR';
export const INCOME_ERROR = 'INCOME_ERROR';
export const CURRENCY = 'CHF';
export const MIN_CASH = 0.1; // Percent of property value
export const AVERAGE_TAX_RATE = 0.25; // Percent
export const SECOND_PILLAR_WITHDRAWAL_TAX_RATE = 0.1; // Percent
export const VAT = 0.077;
export const BONUS_CONSIDERATION = 0.5;
export const BONUS_HISTORY_TO_CONSIDER = 3;
export const COMPANY_INCOME_TO_CONSIDER = 1;
export const DIVIDENDS_CONSIDERATION = 1;
export const DIVIDENDS_HISTORY_TO_CONSIDER = 1;
export const PENSION_INCOME_CONSIDERATION = 1;
export const REAL_ESTATE_INCOME_CONSIDERATION = 1;
export const INVESTMENT_INCOME_CONSIDERATION = 1;
export const FORTUNE_RETURNS_RATIO = 0;
export const ESTIMATED_COMMISSION = 0.01;
export const REFERRAL_COMMISSION = 0.25;
export const REFERRAL_COMMISSION_SPLIT = 0.5;
// Add extra 1 so that rounding errors don't break the comparison
// f.ex: ???
export const OWN_FUNDS_ROUNDING_AMOUNT = 1001;
export const BONUS_ALGORITHMS = {
  AVERAGE: 'AVERAGE',
  WEAK_AVERAGE: 'WEAK_AVERAGE',
};
export const REAL_ESTATE_INCOME_ALGORITHMS = {
  DEFAULT: 'DEFAULT',
  POSITIVE_NEGATIVE_SPLIT: 'POSITIVE_NEGATIVE_SPLIT',
};
