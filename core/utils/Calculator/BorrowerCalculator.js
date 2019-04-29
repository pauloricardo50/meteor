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
import { BONUS_ALGORITHMS } from '../../config/financeConstants';

export const withBorrowerCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    constructor(config) {
      super(config);
      this.initBorrowerCalculator(config);
    }

    initBorrowerCalculator(config) {
      const middleware = (config && config.borrowerMiddleware) || borrowerExtractorMiddleware;
      const middlewareManager = new MiddlewareManager(this);
      middlewareManager.applyToAllMethods([middleware]);
    }

    getArrayValues({ borrowers, key, mapFunc }) {
      let sum = 0;

      arrayify(borrowers).forEach((borrower) => {
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

        const arr = bonusKeys.map((key) => {
          if (this.bonusAlgorithm === BONUS_ALGORITHMS.AVERAGE) {
            // The regular average puts all the values to 0, instead of undefined
            // This ensures that the average is taken over all the history to consider
            return borrower[key] || 0;
          }
          return borrower[key];
        });

        return (
          acc
          + this.getConsideredValue({
            values: arr,
            history: this.bonusHistoryToConsider,
            weighting: this.bonusConsideration,
          })
        );
      }, 0);

      return Math.max(0, Math.round(total));
    }

    getConsideredValue({ values, history, weighting }) {
      const cleanedUpArray = values.filter(v => v !== undefined);
      const valuesToConsider = cleanedUpArray.slice(Math.max(0, cleanedUpArray.length - history));
      const sum = valuesToConsider.reduce((tot, val) => tot + val, 0);
      return (weighting * sum) / valuesToConsider.length || 0;
    }

    getBorrowerCompletion({ loan, borrowers }) {
      return (
        (this.getBorrowerFilesProgress({ loan, borrowers }).percent
          + this.personalInfoPercent({ borrowers }))
        / 2
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
        this.getFortune({ borrowers })
        + this.getThirdPartyFortune({ borrowers })
        + this.getInsuranceFortune({ borrowers })
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
      return this.getArrayValues({
        borrowers,
        key: 'realEstate',
        mapFunc: ({ income = 0 }) => income,
      });
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
        borrowerIncome
          += this.getRealEstateIncome({ borrowers: borrower }) || 0;
        return total + borrowerIncome;
      }, 0);

      sum -= this.getFormattedExpenses({ borrowers }).subtract;

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

    personalInfoPercentSimple({ borrowers }) {
      const array = arrayify(borrowers).reduce((arr, b) => {
        const simpleFormArray = getBorrowerSimpleArray({
          borrowers: arrayify(borrowers),
          borrowerId: b._id,
        });
        return [...arr, ...getCountedArray(simpleFormArray, b)];
      }, []);

      return getPercent(array);
    }

    borrowerInfoPercent({ borrowers }) {
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
      return getFormValuesHashMultiple(arrayify(borrowers).reduce(
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
      ));
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
        this.getTotalFunds({ borrowers })
        + this.getRealEstateFortune({ borrowers })
        + this.getOtherFortune({ borrowers })
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

    // Returns an object with all the types of expenses, combined between
    // borrowers:
    // {
    //  LEASING: 23000,
    //  WELFARE: 4000,
    //  THEORETICAL_REAL_ESTATE: 30000,
    //  etc
    // }
    getAllExpenses({ borrowers }) {
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
      return this.expensesSubtractFromIncome.indexOf(expenseType) >= 0;
    }

    // Returns an object with all expenses to subtract from income
    // or all expenses to add to expenses, depending on the param `toSubtractFromIncome`¨
    // {
    //  LEASING: 23000,
    // }
    getGroupedExpensesBySide({ borrowers, toSubtractFromIncome = true }) {
      const expenses = this.getAllExpenses({ borrowers });

      return Object.keys(expenses)
        .filter(expenseType =>
          (toSubtractFromIncome
            ? this.expensesSubtractFromIncome.indexOf(expenseType) >= 0
            : this.expensesSubtractFromIncome.indexOf(expenseType) < 0))
        .reduce(
          (obj, expenseType) => ({
            ...obj,
            [expenseType]: expenses[expenseType],
          }),
          {},
        );
    }

    // Returns an object with 2 keys, `subtract` and `add` that contain the sum
    // of all expenses to "subtract from income" and "add to expenses", respectively
    getFormattedExpenses({ borrowers }) {
      const expenses = this.getAllExpenses({ borrowers });

      return Object.keys(expenses).reduce(
        (obj, expenseType) => {
          if (this.expensesSubtractFromIncome.indexOf(expenseType) >= 0) {
            return { ...obj, subtract: obj.subtract + expenses[expenseType] };
          }

          return { ...obj, add: obj.add + expenses[expenseType] };
        },
        { subtract: 0, add: 0 },
      );
    }

    getCommentsForExpenseType({ borrowers, type }) {
      return arrayify(borrowers).reduce((comments, { expenses = [] }) => {
        const expensesOfType = expenses.filter(({ description }) => description === type);
        return [
          ...comments,
          ...expensesOfType.map(({ comment }) => comment),
        ].filter(x => x);
      }, []);
    }

    getCommentsForOtherIncomeType({ borrowers, type }) {
      return arrayify(borrowers).reduce((comments, { otherIncome = [] }) => {
        const otherIncomeOfType = otherIncome.filter(({ description }) => description === type);
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
