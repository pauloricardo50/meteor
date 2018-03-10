import Borrowers from '../borrowers';

export default class {
  static update = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $set: object });

  static insert = ({ borrower, userId }) =>
    Borrowers.insert({ ...borrower, userId });

  static remove = ({ borrowerId }) => Borrowers.remove(borrowerId);

  static pushValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $push: object });

  static popValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pop: object });
}
