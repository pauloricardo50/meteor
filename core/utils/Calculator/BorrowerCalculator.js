// @flow
import { FinanceCalculator } from '../FinanceCalculator';
import { filesPercent } from '../../api/files/fileHelpers';
import { getBorrowerInfoArray } from '../../arrays/BorrowerFormArray';
import { borrowerDocuments } from '../../api/files/documents';
import { FILE_STEPS } from '../../api/constants';
import { arrayify, getPercent } from '../general';
import { getCountedArray } from '../formArrayHelpers';
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

    sumValues = ({ borrowers, keys }) =>
      arrayify(keys).reduce(
        (total, key) =>
          total + arrayify(borrowers).reduce((t, b) => t + (b[key] || 0), 0),
        0,
      );

    // personalInfoPercent - Determines the completion rate of the borrower's
    // personal information forms
    personalInfoPercent = ({ borrowers }) => {
      const a = [];
      arrayify(borrowers).forEach((b) => {
        const formArray = getBorrowerInfoArray({
          borrowers: arrayify(borrowers),
          borrowerId: b._id,
        });
        getCountedArray(formArray, b, a);
      });

      return getPercent(a);
    };

    auctionFilesPercent = ({ borrowers }) => {
      const a = [];
      arrayify(borrowers).forEach((b) => {
        const fileArray = borrowerDocuments(b).auction;

        fileArray.forEach(f => f.condition !== false && a.push(b.files[f.id]));
      });

      return getPercent(a);
    };

    getFortune = ({ borrowers }) =>
      this.sumValues({ borrowers, keys: 'bankFortune' });

    getInsuranceFortune = ({ borrowers }) =>
      this.sumValues({
        borrowers,
        keys: ['insuranceSecondPillar', 'insuranceThirdPillar'],
      });

    getBorrowerCompletion = ({ borrower }) =>
      (filesPercent({
        doc: [borrower],
        fileArrayFunc: borrowerDocuments,
        step: FILE_STEPS.AUCTION,
      })
        + this.personalInfoPercent([borrower])
        + (borrower.logic.hasValidatedFinances ? 1 : 0))
      / 3;

    getBonusIncome = ({ borrowers }) => {
      let total = 0;
      arrayify(borrowers).forEach((borrower) => {
        if (borrower.bonus) {
          let arr = Object.keys(borrower.bonus).map(key => borrower.bonus[key]);
          if (arr.length < 1) {
            return;
          }
          if (arr.length > 4) {
            throw new Error('too many bonuses provided');
          }

          arr = arr.map(v => v || 0);
          // Sum all values, remove the lowest one, and return 50% of their average
          let sum = arr.reduce((tot, val) => tot + val, 0);

          if (arr.length > 3) {
            sum -= Math.min(...arr);
          }
          total = 0.5 * (sum / Math.min(3, arr.length)) || 0;
        }
      });

      return Math.max(0, Math.round(total));
    };

    getArrayValues = ({ borrowers, key, mapFunc }) => {
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
    };

    getOtherIncome = ({ borrowers }) =>
      this.getArrayValues({ borrowers }, 'otherIncome');

    getExpenses = ({ borrowers }) =>
      this.getArrayValues({ borrowers }, 'expenses');

    getBorrowerIncome = ({ borrowers }) => {
      const sum = arrayify(borrowers).reduce((total, borrower) => {
        let borrowerIncome = 0;
        borrowerIncome += borrower.salary || 0;
        borrowerIncome += this.getBonusIncome({ borrowers: borrower }) || 0;
        borrowerIncome += this.getOtherIncome({ borrowers: borrower }) || 0;
        borrowerIncome -= this.getExpenses({ borrowers: borrower }) || 0;
        return total + borrowerIncome;
      }, 0);

      return sum;
    };

    getTotalFunds = ({ borrowers }) =>
      this.sumValues({
        borrowers,
        keys: ['bankFortune', 'insuranceSecondPillar', 'insuranceThirdPillar'],
      });

    getRealEstateFortune = ({ borrowers }) =>
      this.getArrayValues({
        borrowers,
        key: 'realEstate',
        mapFunc: i => i.value - i.loan,
      });

    getRealEstateValue = ({ borrowers }) =>
      this.getArrayValues({ borrowers, key: 'realEstate' });

    getRealEstateDebt = ({ borrowers }) =>
      this.getArrayValues({
        borrowers,
        key: 'realEstate',
        mapFunc: i => i.loan,
      });

    getBorrowerSalary = ({ borrowers }) =>
      this.sumValues({ borrowers, keys: 'salary' });

    getSecondPillar = ({ borrowers }) =>
      this.sumValues({ borrowers, keys: 'insuranceSecondPillar' });

    getThirdPillar = ({ borrowers }) =>
      this.sumValues({ borrowers, keys: 'insuranceThirdPillar' });

    getBorrowerFullName = ({ firstName, lastName }) =>
      [firstName, lastName].filter(name => name).join(' ');
  };

export const BorrowerCalculator = withBorrowerCalculator(FinanceCalculator);

export default new BorrowerCalculator();
