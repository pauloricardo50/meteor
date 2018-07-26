import { filesPercent } from '../api/files/fileHelpers';
import { getBorrowerInfoArray } from '../arrays/BorrowerFormArray';
import { borrowerDocuments } from '../api/files/documents';
import { FILE_STEPS } from '../api/constants';
import { arrayify, getPercent } from './general';
import { getCountedArray } from './formArrayHelpers';

export class BorrowerUtils {
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

  getFortune = ({ borrowers }) => {
    const array = [];

    arrayify(borrowers).forEach((b) => {
      array.push(b.bankFortune);
    });
    return array.reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
  };

  getInsuranceFortune = ({ borrowers }) => {
    const array = [];

    arrayify(borrowers).forEach((b) => {
      array.push(b.insuranceSecondPillar);
      array.push(b.insuranceThirdPillar);
    });
    return array.reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
  };

  getBorrowerCompletion = ({ borrower }) => (filesPercent({
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
        ...(borrower[key] ? borrower[key].map(mapFunc || (i => i.value)) : []),
      ].reduce((tot, val) => (val > 0 && tot + val) || tot, 0);
    });

    return Math.max(0, Math.round(sum));
  };

  getOtherIncome = ({ borrowers }) => this.getArrayValues({ borrowers }, 'otherIncome');

  getExpenses = ({ borrowers }) => this.getArrayValues({ borrowers }, 'expenses');

  getBorrowerIncome = ({ borrowers }) => {
    let sum = 0;

    arrayify(borrowers).forEach((borrower) => {
      sum += borrower.salary || 0;
      sum += this.getBonusIncome({ borrowers: borrower }) || 0;
      sum += this.getOtherIncome({ borrowers: borrower }) || 0;
      sum -= this.getExpenses({ borrowers: borrower }) || 0;
    });

    return Math.max(sum, 0);
  };

  getTotalFortune = ({ borrowers }) => {
    let sum = 0;

    arrayify(borrowers).forEach((borrower) => {
      sum += borrower.bankFortune || 0;
      sum += borrower.insuranceSecondPillar || 0;
      sum += borrower.insuranceThirdPillar || 0;

      // TODO: Complete with all fortune fields !!
    });

    return Math.max(0, Math.round(sum));
  };

  getRealEstateFortune = ({ borrowers }) => this.getArrayValues({ borrowers }, 'realEstate', i => i.value - i.loan);

  getRealEstateValue = ({ borrowers }) => this.getArrayValues({ borrowers }, 'realEstate');

  getRealEstateDebt = ({ borrowers }) => this.getArrayValues({ borrowers }, 'realEstate', i => i.loan);

  getBorrowerSalary = ({ borrowers }) => arrayify(borrowers).reduce((t, b) => t + (b.salary || 0), 0);

  getBorrowerFullName = ({ firstName, lastName }) => [firstName, lastName].filter(name => name).join(' ');
}

export default new BorrowerUtils();
