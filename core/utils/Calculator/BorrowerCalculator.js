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

export const withBorrowerCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    constructor(config) {
      super(config);
      this.initBorrowerCalculator(config);
    }

    initBorrowerCalculator(config) {
      if (config && config.borrowerMiddleware) {
        const middlewareManager = new MiddlewareManager(this);
        middlewareManager.applyToAllMethods([config.borrowerMiddleware]);
      }
    }

    getArrayValues({ borrowers, key, mapFunc }) {
      let sum = 0;

      arrayify(borrowers).forEach((borrower) => {
        if (!borrower[key]) {
          return 0;
        }
        sum += [
          ...(borrower[key]
            ? borrower[key].map(mapFunc || (i => i.value))
            : []),
        ].reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
      });

      return Math.max(0, Math.round(sum));
    }

    getBonusIncome({ borrowers }) {
      const bonusKeys = ['bonus2015', 'bonus2016', 'bonus2017', 'bonus2018'];
      const total = arrayify(borrowers).reduce((acc, borrower) => {
        if (!borrower.bonusExists) {
          return 0;
        }

        const arr = bonusKeys.map(key => borrower[key]);
        const cleanedUpArray = arr.filter(v => v !== undefined);

        // Sum all values, remove the lowest one, and return 50% of their average
        let sum = cleanedUpArray.reduce((tot, val) => tot + val, 0);

        if (cleanedUpArray.length > 3) {
          sum -= Math.min(...arr);
        }
        return acc + (0.5 * (sum / Math.min(3, cleanedUpArray.length)) || 0);
      }, 0);

      return Math.max(0, Math.round(total));
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
        percent: percentages.percent / percentages.count,
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
      console.log('val', val);
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
      return this.sumValues({ borrowers, keys: 'salary' });
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

    getNetFortune(borrowers) {
      return (
        this.getTotalFunds({ borrowers })
        + this.getRealEstateFortune({ borrowers })
        + this.getOtherFortune({ borrowers })
      );
    }
  };

export const BorrowerCalculator = withBorrowerCalculator(FinanceCalculator);

export default new BorrowerCalculator();
