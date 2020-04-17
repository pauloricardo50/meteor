import moment from 'moment';

import { OWN_FUNDS_TYPES } from '../../api/borrowers/borrowerConstants';
import { getBorrowerDocuments } from '../../api/files/documents';
import {
  filesPercent,
  getMissingDocumentIds,
  getRequiredDocumentIds,
} from '../../api/files/fileHelpers';
import {
  EXPENSE_TYPES,
  INCOME_CONSIDERATION_TYPES,
} from '../../api/lenderRules/lenderRulesConstants';
import { RESIDENCE_TYPE } from '../../api/properties/propertyConstants';
import {
  getBorrowerFinanceArray,
  getBorrowerInfoArray,
  getBorrowerSimpleArray,
} from '../../arrays/BorrowerFormArray';
import {
  AMORTIZATION_YEARS_INVESTMENT,
  BONUS_ALGORITHMS,
  REAL_ESTATE_INCOME_ALGORITHMS,
} from '../../config/financeConstants';
import {
  getCountedArray,
  getFormValuesHashMultiple,
  getMissingFieldIds,
  getRequiredFieldIds,
} from '../formArrayHelpers';
import { arrayify, getPercent } from '../general';
import MiddlewareManager from '../MiddlewareManager';
import { borrowerExtractorMiddleware } from './middleware';

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

      borrowers.forEach(borrower => {
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
      return borrowers.reduce((obj, borrower) => {
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
      const total = borrowers.reduce((acc, borrower) => {
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
      const percentages = borrowers.reduce(
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
        OWN_FUNDS_TYPES.DONATION,
        OWN_FUNDS_TYPES.BANK_FORTUNE,
      ].includes(type);

    getFunds({ borrowers, type }) {
      if (this.isTypeWithArrayValues(type)) {
        return this.getArrayValues({ borrowers, key: type });
      }

      return this.sumValues({ borrowers, keys: type });
    }

    getFortune({ borrowers }) {
      return this.getArrayValues({
        borrowers,
        key: OWN_FUNDS_TYPES.BANK_FORTUNE,
      });
    }

    getDonationFortune({ borrowers }) {
      const val = this.getArrayValues({
        borrowers,
        key: OWN_FUNDS_TYPES.DONATION,
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
        this.getInsurance3A,
        this.getInsurance3B,
        this.getBank3A,
        this.getDonationFortune,
      ].reduce((sum, func) => sum + func({ borrowers }), 0);
    }

    getMissingBorrowerFields({ borrowers }) {
      const res = borrowers.reduce((missingIds, borrower) => {
        const formArray = getBorrowerInfoArray({
          borrowers,
          borrowerId: borrower._id,
        });
        const formArray2 = getBorrowerFinanceArray({
          borrowers,
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

    getRequiredBorrowerFields({ borrowers }) {
      const res = borrowers.reduce((fieldIds, borrower) => {
        const formArray = getBorrowerInfoArray({
          borrowers,
          borrowerId: borrower._id,
        });
        const formArray2 = getBorrowerFinanceArray({
          borrowers,
          borrowerId: borrower._id,
        });

        return [
          ...fieldIds,
          ...getRequiredFieldIds(formArray, borrower),
          ...getRequiredFieldIds(formArray2, borrower),
        ];
      }, []);

      return res;
    }

    getValidBorrowerFieldsRatio({ borrowers }) {
      const requiredFields = this.getRequiredBorrowerFields({ borrowers });
      const missingFields = this.getMissingBorrowerFields({ borrowers });
      return {
        valid: requiredFields.length - missingFields.length,
        required: requiredFields.length,
      };
    }

    getMissingBorrowerDocuments({ loan, borrowers, basicDocumentsOnly }) {
      return borrowers.reduce(
        (missingIds, borrower) => [
          ...missingIds,
          ...getMissingDocumentIds({
            doc: borrower,
            fileArray: getBorrowerDocuments({ loan, id: borrower._id }, this),
            basicDocumentsOnly,
          }),
        ],
        [],
      );
    }

    getRequiredBorrowerDocumentIds({ loan, borrowers }) {
      return borrowers.reduce(
        (requiredIds, borrower) => [
          ...requiredIds,
          ...getRequiredDocumentIds(
            getBorrowerDocuments({ loan, id: borrower._id }, this),
          ),
        ],
        [],
      );
    }

    getValidBorrowerDocumentsRatio({ loan, borrowers }) {
      const requiredDocments = this.getRequiredBorrowerDocumentIds({
        loan,
        borrowers,
      });
      const missingDocuments = this.getMissingBorrowerDocuments({
        loan,
        borrowers,
      });

      return {
        valid: requiredDocments.length - missingDocuments.length,
        required: requiredDocments.length,
      };
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
        this.getInsuranceFortune({ borrowers }) +
        this.getDonationFortune({ borrowers })
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
      let sum = borrowers.reduce((total, borrower) => {
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
        (obj, borrower, index) => ({
          ...obj,
          [`${`retirementDate${index + 1}`}`]: this.getRetirementDate(borrower),
        }),
        {},
      );

      return this.getYearsToRetirement(argMap);
    }

    getRetirementDate(borrower) {
      const { birthDate } = borrower;
      const retirementAge = this.getRetirementForGender(borrower);
      return moment(birthDate).add(retirementAge, 'years');
    }

    getAmortizationYears({ loan, structureId, offerOverride, borrowers }) {
      const offer = this.selectOffer({ loan, structureId });
      const offerToUse = offerOverride || offer;

      if (offerToUse) {
        return offerToUse.amortizationYears;
      }

      const { residenceType } = loan;
      const retirement = this.getRetirement({ borrowers });
      let min = [this.amortizationYears];

      if (residenceType === RESIDENCE_TYPE.INVESTMENT) {
        min = [...min, AMORTIZATION_YEARS_INVESTMENT];
      }

      return retirement ? Math.min(retirement, ...min) : Math.min(...min);
    }

    // personalInfoPercent - Determines the completion rate of the borrower's
    // personal information forms
    personalInfoPercent({ borrowers }) {
      if (!borrowers || (Array.isArray(borrowers) && !borrowers.length)) {
        return 0;
      }

      const array = borrowers.reduce((arr, b) => {
        const personalFormArray = getBorrowerInfoArray({
          borrowers,
          borrowerId: b._id,
        });
        const financeFormArray = getBorrowerFinanceArray({
          borrowers,
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
      const array = borrowers.reduce((arr, b) => {
        const simpleFormArray = getBorrowerSimpleArray({
          borrowers,
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
      const array = borrowers.reduce((arr, b) => {
        const personalFormArray = getBorrowerInfoArray({
          borrowers,
          borrowerId: b._id,
        });
        return [...arr, ...getCountedArray(personalFormArray, b)];
      }, []);

      return getPercent(array);
    }

    borrowerFinancePercent({ borrowers }) {
      const array = borrowers.reduce((arr, b) => {
        const financeFormArray = getBorrowerFinanceArray({
          borrowers,
          borrowerId: b._id,
        });
        return [...arr, ...getCountedArray(financeFormArray, b)];
      }, []);

      return getPercent(array);
    }

    getBorrowerFormArraysForHash({ borrowers }) {
      return borrowers.reduce(
        (arr, borrower) => [
          ...arr,
          {
            formArray: getBorrowerFinanceArray({
              borrowers,
              borrowerId: borrower._id,
            }),
            doc: borrower,
          },
          {
            formArray: getBorrowerInfoArray({
              borrowers,
              borrowerId: borrower._id,
            }),
            doc: borrower,
          },
        ],
        [],
      );
    }

    getBorrowerFormHash({ borrowers }) {
      return getFormValuesHashMultiple(
        this.getBorrowerFormArraysForHash({ borrowers }),
      );
    }

    sumValues({ borrowers, keys }) {
      return arrayify(keys).reduce(
        (total, key) =>
          total + borrowers.reduce((t, b) => t + (b[key] || 0), 0),
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
      const realEstate = borrowers.reduce(
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
      const allRealEstate = borrowers
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

    getRealEstateCost({ loan, value, theoreticalExpenses }) {
      if (theoreticalExpenses >= 0) {
        // This function returns a monthly cost
        return theoreticalExpenses / 12;
      }

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
      const defaultExpenses = {
        ...this.getGroupedExpenses({ borrowers }),
      };

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
          ...defaultExpenses,
        };
      }

      return {
        [EXPENSE_TYPES.THEORETICAL_REAL_ESTATE]:
          this.getRealEstateExpenses({ borrowers }) * 12, // All expenses are annualized
        ...defaultExpenses,
      };
    }

    // Same as getAllExpenses, but without real estate expenses
    getGroupedExpenses({ borrowers }) {
      const flattenedExpenses = []
        .concat([], ...borrowers.map(({ expenses }) => expenses))
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
      return borrowers.reduce((comments, { expenses = [] }) => {
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
      return borrowers.reduce((comments, { otherIncome = [] }) => {
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

      const bankFortune = this.getFortune({ borrowers });
      if (!bankFortune) {
        return false;
      }

      const salary = this.getSalary({ borrowers });
      if (!salary || salary === 0) {
        return false;
      }

      return true;
    }
  };
