import {
  AMORTIZATION_STOP,
  AMORTIZATION_YEARS,
  INTERESTS_FINMA,
  MAINTENANCE_FINMA,
  MAX_BORROW_RATIO_PRIMARY_PROPERTY,
  MAX_BORROW_RATIO_WITH_PLEDGE,
  MAX_INCOME_RATIO,
  NOTARY_FEES,
} from 'core/config/financeConstants';
import { roundTo } from 'core/utils/conversionFunctions';

import { MAINTENANCE_REAL } from '../../core/config/financeConstants';

export const getLoanValue = (propertyValue, fortune) =>
  propertyValue * (1 + NOTARY_FEES) - fortune;

export const suggestSalary = ({ property, fortune }) => {
  const loan = property * (1 + NOTARY_FEES) - fortune;
  const m = MAINTENANCE_FINMA;
  const i = INTERESTS_FINMA;
  const mR = MAX_INCOME_RATIO;

  const withAmortizing =
    (property * m + loan * (i + (loan - 0.65 * property) / (15 * loan))) / mR;

  const withoutAmortizing = (property * m + loan * i) / mR;

  return Math.round(Math.max(withAmortizing, withoutAmortizing) + 1);
};

// This function is documented in the google drive: "Maths widget1.pdf" document
export const suggestFortune = ({
  property,
  salary,
  notaryFees = NOTARY_FEES,
}) => {
  const m = MAINTENANCE_FINMA;
  const i = INTERESTS_FINMA;
  const mR = MAX_INCOME_RATIO;
  const nF = notaryFees;

  // It has to cover 20% and notaryfees
  const basicValue = property * (0.2 + nF);

  // When there is very little income, go to rank 1 (basically, amortization = 0)
  const rank1Fortune = (property * (m + i * (1 + nF)) - mR * salary) / i;

  // For the case that there is a reasonable amount of fortune, go to rank 2
  // Here amortization is complex and depends on the borrow Ratio
  const rank2Fortune =
    (property * (15 * m + nF + 0.35 + 15 * i * (1 + nF)) - mR * 15 * salary) /
    (15 * i + 1);

  const rankFortune = Math.max(rank1Fortune, rank2Fortune);

  const maxFortune = Math.round(Math.max(0, rankFortune, basicValue));

  // Make sure fortune never goes above the property value
  return Math.min(maxFortune, property);
};

// This function is documented in the google drive: "Maths widget1.pdf" document
export const getSalaryLimitedProperty = ({ salary, fortune }) => {
  // The arithmetic relation to have the cost of the loan be at exactly the max ratio of income
  // Derive it like this:
  // maxRatio * salary >= property * maintenance + loan * loanCost
  // loan = (property + notaryFees + lppFees) - totalFortune
  // Extract property from this relation
  const nF = NOTARY_FEES;
  const i = INTERESTS_FINMA;
  const mR = MAX_INCOME_RATIO;
  const m = MAINTENANCE_FINMA;
  const r = AMORTIZATION_YEARS;

  // The first one is with 0 amortization
  const incomeLimited1 = (mR * salary + fortune * i) / (m + (1 + nF) * i);

  // The second is with amortization factored in (and it could be negative due to math)
  const incomeLimited2 =
    ((1 + r * i) * fortune + mR * r * salary) /
    (r * (m + i) + nF * (1 + r * i) + 0.35);

  // Therefore, take the minimum value of both, which is the most limiting one
  // Because of the ratios, round this value down
  return Math.floor(Math.min(incomeLimited1, incomeLimited2));
};

export const suggestProperty = ({ salary, fortune }) => {
  const fortuneLimitedProperty = fortuneToProperty({ fortune });
  const salaryLimitedProperty = getSalaryLimitedProperty({
    salary,
    fortune,
  });

  // Use floor to make sure the ratios are respected and avoid edge cases
  return Math.round(Math.min(fortuneLimitedProperty, salaryLimitedProperty));
};

//
// Property < > Fortune
//
export const propertyToFortuneRatio = () =>
  1 - MAX_BORROW_RATIO_PRIMARY_PROPERTY + NOTARY_FEES;

export const propertyToFortune = ({ property }) =>
  property * propertyToFortuneRatio();

export const fortuneToProperty = ({ fortune }) =>
  fortune / propertyToFortuneRatio();

export const defaultAmortization = () =>
  (MAX_BORROW_RATIO_PRIMARY_PROPERTY - AMORTIZATION_STOP) /
  MAX_BORROW_RATIO_PRIMARY_PROPERTY /
  AMORTIZATION_YEARS;

export const loanCost = () => INTERESTS_FINMA + defaultAmortization();

export const propertyToSalaryRatio = () =>
  3 * (MAINTENANCE_FINMA + MAX_BORROW_RATIO_PRIMARY_PROPERTY * loanCost());

export const propertyToSalary = ({ property }) =>
  property * propertyToSalaryRatio();

// This one flickers between 80% and >80%, so round it up to make sure
// the loan is always at or below 80%
export const salaryToProperty = ({ salary }) =>
  Math.ceil(salary / propertyToSalaryRatio());

export const suggestWantedLoan = ({ currentLoan }) => currentLoan;

export const getMaxPossibleLoan = (property, salary) => {
  const fortune = suggestFortune({ property, salary, notaryFees: 0 });

  const maxLoan = property - fortune;
  const hardCap = Math.floor(property * MAX_BORROW_RATIO_WITH_PLEDGE);
  return roundTo(Math.min(maxLoan, hardCap), 3);
};

export const getYearlyAmortization = ({
  propertyValue,
  loanValue,
  yearsToRetirement = 15,
}) => {
  const borrowValue = loanValue / propertyValue;
  const percentToAmortize = borrowValue - AMORTIZATION_STOP;

  if (percentToAmortize <= 0) {
    // If you're below the cut-off value, no need to amortize
    return 0;
  }

  // borrowValue is above 65%
  // 15 years amortization is the default, but if you're older, you'll
  // have to amortize faster
  return (percentToAmortize * propertyValue) / yearsToRetirement;
};

// Given the value of a property, the down payment and interest rate,
// return the yearly interests to pay.
// This includes the money lost through NOTARY_FEES
export const getSimpleYearlyInterests = (loanValue, interests) =>
  loanValue * interests;

export const getSimpleYearlyMaintenance = (
  propertyValue,
  maintenanceRate = MAINTENANCE_REAL,
) => maintenanceRate * propertyValue;
