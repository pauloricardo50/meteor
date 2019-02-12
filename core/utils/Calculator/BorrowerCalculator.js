// @flow
import { OWN_FUNDS_TYPES } from 'imports/core/api/constants';
import { getBorrowerDocuments } from 'imports/core/api/files/documents';
import { FinanceCalculator } from '../FinanceCalculator';
import {
  filesPercent,
  getMissingDocumentIds,
} from '../../api/files/fileHelpers';
import {
  getBorrowerInfoArray,
  getBorrowerFinanceArray,
} from '../../arrays/BorrowerFormArray';
import { arrayify, getPercent } from '../general';
import { getCountedArray, getMissingFieldIds } from '../formArrayHelpers';
import MiddlewareManager from '../MiddlewareManager';
import { INCOME_CONSIDERATION_TYPES } from '../../api/constants';
import { borrowerExtractorMiddleware } from './middleware';

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
          return 0;
        }

        const arr = bonusKeys.map(key => borrower[key]);

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
      return arrayify(borrowers).reduce((missingIds, borrower) => {
        const formArray = getBorrowerInfoArray({
          borrowers: arrayify(borrowers),
          borrowerId: borrower._id,
        });

        return [...missingIds, ...getMissingFieldIds(formArray, borrower)];
      }, []);
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
        mapFunc: i => i.value - i.loan,
      });
    }

    getRealEstateValue({ borrowers }) {
      return this.getArrayValues({ borrowers, key: 'realEstate' });
    }

    getRealEstateDebt({ borrowers }) {
      return this.getArrayValues({
        borrowers,
        key: 'realEstate',
        mapFunc: i => i.loan,
      });
    }

    getSalary({ borrowers }) {
      if (this.incomeConsiderationType === INCOME_CONSIDERATION_TYPES.NET) {
        return this.getNetSalary({ borrowers });
      }
      return this.sumValues({ borrowers, keys: 'salary' });
    }

    getNetSalary({ borrowers }) {
      return this.sumValues({ borrowers, keys: 'netSalary' });
    }

    getTotalIncome({ borrowers }) {
      const sum = arrayify(borrowers).reduce((total, borrower) => {
        let borrowerIncome = 0;
        borrowerIncome += borrower.salary || 0;
        borrowerIncome += this.getBonusIncome({ borrowers: borrower }) || 0;
        borrowerIncome += this.getOtherIncome({ borrowers: borrower }) || 0;
        borrowerIncome -= this.getExpenses({ borrowers: borrower }) || 0;
        return total + borrowerIncome;
      }, 0);

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
      const a = [];
      arrayify(borrowers).forEach((b) => {
        const personalFormArray = getBorrowerInfoArray({
          borrowers: arrayify(borrowers),
          borrowerId: b._id,
        });
        const financeFormArray = getBorrowerFinanceArray({
          borrowers: arrayify(borrowers),
          borrowerId: b._id,
        });
        getCountedArray(personalFormArray, b, a);
        getCountedArray(financeFormArray, b, a);
      });

      return getPercent(a);
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
  };

export const BorrowerCalculator = withBorrowerCalculator(FinanceCalculator);

export default new BorrowerCalculator();
