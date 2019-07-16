// @flow
import { OWN_FUNDS_TYPES } from 'imports/core/api/constants';
import { getBorrowerDocuments } from 'imports/core/api/files/documents';
import {
  filesPercent,
  getMissingDocumentIds,
} from '../../api/files/fileHelpers';
import {
  getBorrowerInfoArray,
  getBorrowerFinanceArray,
  getBorrowerSimpleArray,
} from '../../arrays/BorrowerFormArray';
import { arrayify, getPercent } from '../general';
import {
  getCountedArray,
  getMissingFieldIds,
  getFormValuesHashMultiple,
} from '../formArrayHelpers';
import MiddlewareManager from '../MiddlewareManager';
import { INCOME_CONSIDERATION_TYPES, EXPENSE_TYPES } from '../../api/constants';
import { borrowerExtractorMiddleware } from './middleware';
import {
  BONUS_ALGORITHMS,
  REAL_ESTATE_INCOME_ALGORITHMS,
} from '../../config/financeConstants';

export const withBorrowerCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    constructor(config) {
      super(config);
      this.initBorrowerCalculator(config);
    }

    initBorrowerCalculator(config) {
      const middleware =
        (config && config.borrowerMiddleware) || borrowerExtractorMiddleware;
      const middlewareManager = new MiddlewareManager(this);
      middlewareManager.applyToAllMethods([middleware]);
    }

    getArrayValues({ borrowers, key, mapFunc }) {
      let sum = 0;

      arrayify(borrowers).forEach(borrower => {
        if (!borrower[key]) {
          return 0;
        }
        sum += [
          ...(borrower[key] && borrower[key].length > 0
            ? borrower[key].map(mapFunc || (i => i.value))
            : []),
        ].reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
      });

      return Math.max(0, Math.round(sum));
    }

    getBonuses({ borrowers }) {
      return arrayify(borrowers).reduce((obj, borrower) => {
        if (!borrower.bonusExists) {
          return obj;
        }

        const bonusKeys = Object.keys(borrower).filter(
          key =>
            key.includes('bonus') &&
            key !== 'bonusExists' &&
            borrower[key] >= 0 &&
            borrower[key] !== null,
        );

        bonusKeys.forEach(key => {
          const value = borrower[key];

          if (obj[key]) {
            obj = { ...obj, [key]: obj[key] + value };
          } else {
            obj = { ...obj, [key]: value };
          }
        });

        return obj;
      }, {});
    }

    getBonusIncome({ borrowers }) {
      const bonusKeys = [
        'bonus2015',
        'bonus2016',
        'bonus2017',
        'bonus2018',
        'bonus2019',
      ];
      const total = arrayify(borrowers).reduce((acc, borrower) => {
        if (!borrower.bonusExists) {
          return acc + 0;
        }

        const arr = bonusKeys
          .map(key => borrower[key])
          .filter(val =>
            this.bonusAlgorithm === BONUS_ALGORITHMS.WEAK_AVERAGE
              ? val > 0
              : true,
          );

        return (
          acc +
          this.getConsideredValue({
            values: arr,
            history: this.bonusHistoryToConsider,
            weighting: this.bonusConsideration,
          })
        );
      }, 0);
      return Math.max(0, Math.round(total));
    }

    getConsideredValue({ values, history, weighting }) {
      const valuesToConsider = values.slice(
        Math.max(0, values.length - history),
      );
      const sum = valuesToConsider.reduce((tot, val = 0) => tot + val, 0);
      return (weighting * sum) / valuesToConsider.length || 0;
    }

    getBorrowerCompletion({ loan, borrowers }) {
      return (
        (this.getBorrowerFilesProgress({ loan, borrowers }).percent +
          this.personalInfoPercent({ borrowers })) /
        2
      );
    }

    getBorrowerFilesProgress({ loan, borrowers }) {
      const percentages = arrayify(borrowers).reduce(
        (total, borrower) => {
          const { percent, count } = filesPercent({
            fileArray: getBorrowerDocuments({ loan, id: borrower._id }, this),
            doc: borrower,
          });
          return {
            percent: total.percent + percent * count,
            count: total.count + count,
          };
        },
        { percent: 0, count: 0 },
      );

      return {
        ...percentages,
        percent:
          percentages.count === 0 ? 1 : percentages.percent / percentages.count,
      };
    }

    isTypeWithArrayValues = type =>
      [
        OWN_FUNDS_TYPES.INSURANCE_2,
        OWN_FUNDS_TYPES.INSURANCE_3A,
        OWN_FUNDS_TYPES.BANK_3A,
        OWN_FUNDS_TYPES.INSURANCE_3B,
      ].includes(type);

    getFunds({ borrowers, type }) {
      if (this.isTypeWithArrayValues(type)) {
        return this.getArrayValues({ borrowers, key: type });
      }

      return this.sumValues({ borrowers, keys: type });
    }

    getFortune({ borrowers }) {
      return this.sumValues({ borrowers, keys: OWN_FUNDS_TYPES.BANK_FORTUNE });
    }

    getThirdPartyFortune({ borrowers }) {
      const val = this.sumValues({
        borrowers,
        keys: OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE,
      });
      return val;
    }

    getExpenses({ borrowers }) {
      return this.getArrayValues({ borrowers, key: 'expenses' });
    }

    getInsurance2({ borrowers }) {
      return this.getArrayValues({
        borrowers,
        key: OWN_FUNDS_TYPES.INSURANCE_2,
      });
    }

    getInsurance3A({ borrowers }) {
      return this.getArrayValues({
        borrowers,
        key: OWN_FUNDS_TYPES.INSURANCE_3A,
      });
    }

    getBank3A({ borrowers }) {
      return this.getArrayValues({ borrowers, key: OWN_FUNDS_TYPES.BANK_3A });
    }

    getInsurance3B({ borrowers }) {
      return this.getArrayValues({
        borrowers,
        key: OWN_FUNDS_TYPES.INSURANCE_3B,
      });
    }

    getInsuranceFortune({ borrowers }) {
      return [
        this.getInsurance2,
        this.getInsurance3A,
        this.getInsurance3B,
        this.getBank3A,
      ].reduce((sum, func) => sum + func({ borrowers }), 0);
    }

    getCashFortune({ borrowers }) {
      return [
        this.getFortune,
        this.getThirdPartyFortune,
        this.getInsurance3A,
        this.getInsurance3B,
        this.getBank3A,
      ].reduce((sum, func) => sum + func({ borrowers }), 0);
    }

    getMissingBorrowerFields({ borrowers }) {
      const res = arrayify(borrowers).reduce((missingIds, borrower) => {
        const formArray = getBorrowerInfoArray({
          borrowers: arrayify(borrowers),
          borrowerId: borrower._id,
        });
        const formArray2 = getBorrowerFinanceArray({
          borrowers: arrayify(borrowers),
          borrowerId: borrower._id,
        });

        return [
          ...missingIds,
          ...getMissingFieldIds(formArray, borrower),
          ...getMissingFieldIds(formArray2, borrower),
        ];
      }, []);

      return res;
    }

    getMissingBorrowerDocuments({ loan, borrowers }) {
      return arrayify(borrowers).reduce(
        (missingIds, borrower) => [
          ...missingIds,
          ...getMissingDocumentIds({
            doc: borrower,
            fileArray: getBorrowerDocuments({ loan, id: borrower._id }, this),
          }),
        ],
        [],
      );
    }

    getOtherFortune({ borrowers }) {
      return this.getArrayValues({ borrowers, key: 'otherFortune' });
    }

    getOtherIncome({ borrowers }) {
      return this.getArrayValues({ borrowers, key: 'otherIncome' });
    }

    getTotalFunds({ borrowers }) {
      return (
        this.getFortune({ borrowers }) +
        this.getThirdPartyFortune({ borrowers }) +
        this.getInsuranceFortune({ borrowers })
      );
    }

    getRealEstateFortune({ borrowers }) {
      return this.getArrayValues({
        borrowers,
        key: 'realEstate',
        mapFunc: ({ value = 0, loan = 0 }) => value - loan,
      });
    }

    getRealEstateValue({ borrowers }) {
      return this.getArrayValues({ borrowers, key: 'realEstate' });
    }

    getRealEstateDebt({ borrowers }) {
      return this.getArrayValues({
        borrowers,
        key: 'realEstate',
        mapFunc: ({ loan = 0 }) => loan,
      });
    }

    getRealEstateIncome({ borrowers }) {
      const realEstateIncome =
        this.getArrayValues({
          borrowers,
          key: 'realEstate',
          mapFunc: ({ income = 0 }) => income,
        }) * this.realEstateIncomeConsideration;

      return realEstateIncome;
    }

    getRealEstateIncomeTotal({ borrowers }) {
      if (
        this.realEstateIncomeAlgorithm ===
        REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT
      ) {
        return 0;
      }

      return this.getRealEstateIncome({ borrowers });
    }

    shouldUseNetSalary() {
      return this.incomeConsiderationType === INCOME_CONSIDERATION_TYPES.NET;
    }

    getSalary({ borrowers }) {
      if (this.shouldUseNetSalary()) {
        return this.getNetSalary({ borrowers });
      }
      return this.sumValues({ borrowers, keys: 'salary' });
    }

    getNetSalary({ borrowers }) {
      return this.sumValues({ borrowers, keys: 'netSalary' });
    }

    getFortuneReturns({ borrowers }) {
      if (this.fortuneReturnsRatio) {
        return this.fortuneReturnsRatio * this.getFortune({ borrowers });
      }

      return 0;
    }

    getTotalIncome({ borrowers }) {
      let sum = arrayify(borrowers).reduce((total, borrower) => {
        let borrowerIncome = 0;
        borrowerIncome += this.getSalary({ borrowers: borrower }) || 0;
        borrowerIncome += this.getBonusIncome({ borrowers: borrower }) || 0;
        borrowerIncome += this.getOtherIncome({ borrowers: borrower }) || 0;
        borrowerIncome += this.getFortuneReturns({ borrowers: borrower }) || 0;
        borrowerIncome +=
          this.getRealEstateIncomeTotal({ borrowers: borrower }) || 0;
        return total + borrowerIncome;
      }, 0);

      sum -= this.getFormattedExpenses({ borrowers }).subtract || 0;

      return sum;
    }

    getRetirement({ borrowers }) {
      const argMap = borrowers.reduce(
        (obj, { age, gender }, index) => ({
          ...obj,
          [`${`age${index + 1}`}`]: age,
          [`${`gender${index + 1}`}`]: gender,
        }),
        {},
      );
      return this.getYearsToRetirement(argMap);
    }

    getAmortizationDuration({ borrowers }) {
      const retirement = this.getRetirement({ borrowers });
      return Math.min(15, retirement);
    }

    // personalInfoPercent - Determines the completion rate of the borrower's
    // personal information forms
    personalInfoPercent({ borrowers }) {
      if (!borrowers || !borrowers.length) {
        return 0;
      }

      const array = arrayify(borrowers).reduce((arr, b) => {
        const personalFormArray = getBorrowerInfoArray({
          borrowers: arrayify(borrowers),
          borrowerId: b._id,
        });
        const financeFormArray = getBorrowerFinanceArray({
          borrowers: arrayify(borrowers),
          borrowerId: b._id,
        });
        return [
          ...arr,
          ...getCountedArray(personalFormArray, b),
          ...getCountedArray(financeFormArray, b),
        ];
      }, []);

      return getPercent(array);
    }

    personalInfoPercentSimple({ borrowers, loan }) {
      if ((!borrowers || !borrowers.length) && !loan.borrowers.length) {
        return 0;
      }
      const array = arrayify(borrowers).reduce((arr, b) => {
        const simpleFormArray = getBorrowerSimpleArray({
          borrowers: arrayify(borrowers),
          borrowerId: b._id,
          loan,
        });
        return [...arr, ...getCountedArray(simpleFormArray, b)];
      }, []);

      return getPercent(array);
    }

    borrowerInfoPercent({ borrowers }) {
      if (!borrowers || !borrowers.length) {
        return 0;
      }
      const array = arrayify(borrowers).reduce((arr, b) => {
        const personalFormArray = getBorrowerInfoArray({
          borrowers: arrayify(borrowers),
          borrowerId: b._id,
        });
        return [...arr, ...getCountedArray(personalFormArray, b)];
      }, []);

      return getPercent(array);
    }

    borrowerFinancePercent({ borrowers }) {
      const array = arrayify(borrowers).reduce((arr, b) => {
        const financeFormArray = getBorrowerFinanceArray({
          borrowers: arrayify(borrowers),
          borrowerId: b._id,
        });
        return [...arr, ...getCountedArray(financeFormArray, b)];
      }, []);

      return getPercent(array);
    }

    getBorrowerFormHash({ borrowers }) {
      return getFormValuesHashMultiple(
        arrayify(borrowers).reduce(
          (arr, borrower) => [
            ...arr,
            {
              formArray: getBorrowerFinanceArray({
                borrowers: arrayify(borrowers),
                borrowerId: borrower._id,
              }),
              doc: borrower,
            },
            {
              formArray: getBorrowerInfoArray({
                borrowers: arrayify(borrowers),
                borrowerId: borrower._id,
              }),
              doc: borrower,
            },
          ],
          [],
        ),
      );
    }

    sumValues({ borrowers, keys }) {
      return arrayify(keys).reduce(
        (total, key) =>
          total + arrayify(borrowers).reduce((t, b) => t + (b[key] || 0), 0),
        0,
      );
    }

    getNetFortune({ borrowers }) {
      return (
        this.getTotalFunds({ borrowers }) +
        this.getRealEstateFortune({ borrowers }) +
        this.getOtherFortune({ borrowers })
      );
    }

    getMortgageNotes({ borrowers }) {
      return borrowers.reduce(
        (arr, { mortgageNotes: notes = [] }) => [...arr, ...notes],
        [],
      );
    }

    getRealEstateExpenses({ borrowers }) {
      const realEstate = arrayify(borrowers).reduce(
        (arr, borrower) => [...arr, ...(borrower.realEstate || [])],
        [],
      );
      const realEstateCost = realEstate.reduce(
        (tot, obj) => tot + this.getRealEstateCost(obj),
        0,
      );

      return realEstateCost;
    }

    getRealEstateDeltas({ borrowers }) {
      const allRealEstate = arrayify(borrowers)
        .map(({ realEstate }) => realEstate)
        .reduce((arr, realEstate) => [...arr, ...realEstate], []);

      return allRealEstate.map(realEstate => {
        const { income } = realEstate;
        const expenses = this.getRealEstateCost(realEstate) * 12;

        return (
          Math.round(income * this.realEstateIncomeConsideration) - expenses
        );
      });
    }

    getRealEstateCost({ loan, value }) {
      const amortizationRate = this.getAmortizationRateBase({
        borrowRatio: super.getBorrowRatio({ loan, propertyValue: value }),
      });

      return super.getTheoreticalMonthly({
        propAndWork: value,
        loanValue: loan,
        amortizationRate,
      }).total;
    }

    sumArray(arr) {
      return arr.reduce((tot, v = 0) => tot + v, 0);
    }

    // Returns an object with all the types of expenses, combined between
    // borrowers:
    // {
    //  LEASING: 23000,
    //  WELFARE: 4000,
    //  THEORETICAL_REAL_ESTATE: 30000,
    //  etc
    // }
    getAllExpenses({ borrowers }) {
      if (
        this.realEstateIncomeAlgorithm ===
        REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT
      ) {
        const deltas = this.getRealEstateDeltas({
          borrowers,
        });
        return {
          // Negative deltas should be made positive so they can be added to expenses
          [EXPENSE_TYPES.REAL_ESTATE_DELTA_NEGATIVE]: -this.sumArray(
            deltas.filter(delta => delta < 0),
          ),
          // Positive deltas should be made negative so they can be subtracted from income,
          // and therefore increase income
          [EXPENSE_TYPES.REAL_ESTATE_DELTA_POSITIVE]: -this.sumArray(
            deltas.filter(delta => delta > 0),
          ),
          ...this.getGroupedExpenses({ borrowers }),
        };
      }

      return {
        [EXPENSE_TYPES.THEORETICAL_REAL_ESTATE]:
          this.getRealEstateExpenses({ borrowers }) * 12, // All expenses are annualized
        ...this.getGroupedExpenses({ borrowers }),
      };
    }

    // Same as getAllExpenses, but without real estate expenses
    getGroupedExpenses({ borrowers }) {
      const flattenedExpenses = []
        .concat([], ...arrayify(borrowers).map(({ expenses }) => expenses))
        .filter(x => x);
      return flattenedExpenses.reduce(
        (obj, { value, description }) => ({
          ...obj,
          [description]: (obj[description] || 0) + value,
        }),
        {},
      );
    }

    shouldSubtractExpenseFromIncome(expenseType) {
      return this.expensesSubtractFromIncome.includes(expenseType);
    }

    groupRealEstateDeltas({ groupedExpenses, expenses, toSubtractFromIncome }) {
      const negativeDeltas = expenses[EXPENSE_TYPES.REAL_ESTATE_DELTA_NEGATIVE];
      const positiveDeltas = expenses[EXPENSE_TYPES.REAL_ESTATE_DELTA_POSITIVE];

      if (toSubtractFromIncome) {
        // If we want to get expenses to subtract from income, add the
        // positiveDeltas negatively, so they are in fact added to income
        return {
          ...groupedExpenses,
          [EXPENSE_TYPES.REAL_ESTATE_DELTA_POSITIVE]: positiveDeltas,
        };
      }

      return {
        ...groupedExpenses,
        [EXPENSE_TYPES.REAL_ESTATE_DELTA_NEGATIVE]: negativeDeltas,
      };
    }

    // Returns an object with all expenses to subtract from income
    // or all expenses to add to expenses, depending on the param `toSubtractFromIncome`¨
    // {
    //  LEASING: 23000,
    // }
    getGroupedExpensesBySide({ borrowers, toSubtractFromIncome = true }) {
      const expenses = this.getAllExpenses({ borrowers });

      const expensesBySide = Object.keys(expenses)
        .filter(expenseType => !this.expenseTypeIsDelta(expenseType))
        .filter(expenseType => {
          const subtractExpenseTypeFromIncome = this.expensesSubtractFromIncome.includes(
            expenseType,
          );
          return toSubtractFromIncome
            ? subtractExpenseTypeFromIncome
            : !subtractExpenseTypeFromIncome;
        });

      const groupedExpenses = expensesBySide.reduce(
        (obj, expenseType) => ({
          ...obj,
          [expenseType]: expenses[expenseType],
        }),
        {},
      );

      if (
        this.realEstateIncomeAlgorithm ===
        REAL_ESTATE_INCOME_ALGORITHMS.POSITIVE_NEGATIVE_SPLIT
      ) {
        return this.groupRealEstateDeltas({
          groupedExpenses,
          expenses,
          toSubtractFromIncome,
        });
      }

      return groupedExpenses;
    }

    expenseTypeIsDelta(expenseType) {
      return [
        EXPENSE_TYPES.REAL_ESTATE_DELTA_NEGATIVE,
        EXPENSE_TYPES.REAL_ESTATE_DELTA_POSITIVE,
      ].includes(expenseType);
    }

    formatRealEstateExpenses({ obj, expenseType, value }) {
      if (expenseType === EXPENSE_TYPES.REAL_ESTATE_DELTA_NEGATIVE) {
        return { ...obj, add: obj.add + value };
      }

      return { ...obj, subtract: obj.subtract + value };
    }

    // Returns an object with 2 keys, `subtract` and `add` that contain the sum
    // of all expenses to "subtract from income" and "add to expenses", respectively
    getFormattedExpenses({ borrowers }) {
      const expenses = this.getAllExpenses({ borrowers });

      return Object.keys(expenses).reduce(
        (obj, expenseType) => {
          const value = expenses[expenseType];
          if (this.expenseTypeIsDelta(expenseType)) {
            return this.formatRealEstateExpenses({ obj, expenseType, value });
          }

          if (this.expensesSubtractFromIncome.indexOf(expenseType) >= 0) {
            return { ...obj, subtract: obj.subtract + value };
          }

          return { ...obj, add: obj.add + value };
        },
        { subtract: 0, add: 0 },
      );
    }

    getCommentsForExpenseType({ borrowers, type }) {
      return arrayify(borrowers).reduce((comments, { expenses = [] }) => {
        const expensesOfType = expenses.filter(
          ({ description }) => description === type,
        );
        return [
          ...comments,
          ...expensesOfType.map(({ comment }) => comment),
        ].filter(x => x);
      }, []);
    }

    getCommentsForOtherIncomeType({ borrowers, type }) {
      return arrayify(borrowers).reduce((comments, { otherIncome = [] }) => {
        const otherIncomeOfType = otherIncome.filter(
          ({ description }) => description === type,
        );
        return [
          ...comments,
          ...otherIncomeOfType.map(({ comment }) => comment),
        ].filter(x => x);
      }, []);
    }

    canCalculateSolvency({ borrowers }) {
      if (!borrowers.length) {
        return false;
      }

      if (this.getCashFortune({ borrowers }) === 0) {
        return false;
      }

      if (this.getSalary({ borrowers }) === 0) {
        return false;
      }

      return true;
    }
  };
