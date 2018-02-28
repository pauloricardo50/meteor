import Borrowers from '../borrowers';

export default class {
  static update = ({ borrowerId, borrower }) =>
    Borrowers.update(borrowerId, { $set: borrower });

  static insert = ({ borrower, userId }) =>
    Borrowers.insert({ ...borrower, userId });

  static remove = ({ borrowerId }) => Borrowers.remove(borrowerId);

  static pushValue = ({ borrowerId, borrower }) =>
    Borrowers.update(borrowerId, { $push: borrower });
}
