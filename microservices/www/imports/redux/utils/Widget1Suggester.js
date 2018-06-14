import {
  NOTARY_FEES,
  MAINTENANCE_FINMA,
  INTERESTS_FINMA,
  MAX_INCOME_RATIO,
  MAX_BORROW_RATIO_PRIMARY_PROPERTY,
  MAX_BORROW_RATIO_WITH_INSURANCE,
  AMORTIZATION_STOP,
  MAX_AMORTIZATION_DURATION,
} from 'core/config/financeConstants';

export class Widget1SuggesterClass {
  constructor({ notaryFees }) {
    this.notaryFees = notaryFees || NOTARY_FEES;
  }
  // This function is documented in the google drive: "Maths widget1.pdf" document
  suggestSalary = ({ property, fortune }) => {
    const loan = property * (1 + this.notaryFees) - fortune;
    const m = MAINTENANCE_FINMA;
    const i = INTERESTS_FINMA;
    const mR = MAX_INCOME_RATIO;

    const withAmortizing =
      (property * m + loan * (i + (loan - 0.65 * property) / (15 * loan))) / mR;

    const withoutAmortizing = (property * m + loan * i) / mR;

    return Math.ceil(Math.max(withAmortizing, withoutAmortizing) + 1);
  };

  // This function is documented in the google drive: "Maths widget1.pdf" document
  suggestFortune = ({ property, salary }) => {
    const m = MAINTENANCE_FINMA;
    const i = INTERESTS_FINMA;
    const mR = MAX_INCOME_RATIO;
    const nF = this.notaryFees;

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

    const maxFortune = Math.ceil(Math.max(0, rankFortune, basicValue));

    // Make sure fortune never goes above the property value
    return Math.min(maxFortune, property);
  };

  // This function is documented in the google drive: "Maths widget1.pdf" document
  getSalaryLimitedProperty = ({ salary, fortune }) => {
    // The arithmetic relation to have the cost of the loan be at exactly the max ratio of income
    // Derive it like this:
    // maxRatio * salary >= property * maintenance + loan * loanCost
    // loan = (property + notaryFees + lppFees) - totalFortune
    // Extract property from this relation
    const nF = this.notaryFees;
    const i = INTERESTS_FINMA;
    const mR = MAX_INCOME_RATIO;
    const m = MAINTENANCE_FINMA;
    const r = MAX_AMORTIZATION_DURATION;

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

  suggestProperty = ({ salary, fortune }) => {
    const fortuneLimitedProperty = this.fortuneToProperty({ fortune });
    const salaryLimitedProperty = this.getSalaryLimitedProperty({
      salary,
      fortune,
    });

    // Use floor to make sure the ratios are respected and avoid edge cases
    return Math.round(Math.min(fortuneLimitedProperty, salaryLimitedProperty));
  };

  //
  // Property < > Fortune
  //
  propertyToFortuneRatio = () =>
    1 - MAX_BORROW_RATIO_PRIMARY_PROPERTY + this.notaryFees;
  propertyToFortune = ({ property }) =>
    property * this.propertyToFortuneRatio();
  fortuneToProperty = ({ fortune }) => fortune / this.propertyToFortuneRatio();

  //
  // Property < > Salary
  //
  defaultAmortization = () =>
    (MAX_BORROW_RATIO_PRIMARY_PROPERTY - AMORTIZATION_STOP) /
    MAX_BORROW_RATIO_PRIMARY_PROPERTY /
    MAX_AMORTIZATION_DURATION;
  loanCost = () => INTERESTS_FINMA + this.defaultAmortization();
  propertyToSalaryRatio = () =>
    3 *
    (MAINTENANCE_FINMA + MAX_BORROW_RATIO_PRIMARY_PROPERTY * this.loanCost());
  propertyToSalary = ({ property }) => property * this.propertyToSalaryRatio();
  // This one flickers between 80% and >80%, so round it up to make sure
  // the loan is always at or below 80%
  salaryToProperty = ({ salary }) =>
    Math.ceil(salary / this.propertyToSalaryRatio());

  suggestWantedLoan = ({ currentLoan }) => currentLoan;

  getMaxPossibleLoan = ({ property, salary }) => {
    const currentNotaryFees = this.notaryFees;
    this.notaryFees = 0;
    const fortune = this.suggestFortune({ property, salary });
    this.notaryFees = currentNotaryFees;
    const maxLoan = property - fortune;
    const hardCap = Math.floor(property * MAX_BORROW_RATIO_WITH_INSURANCE);
    return Math.min(maxLoan, hardCap);
  };
}

export default new Widget1SuggesterClass({});
