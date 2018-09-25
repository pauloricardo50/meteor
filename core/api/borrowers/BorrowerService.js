import Borrowers from '.';
import LoanService from '../loans/LoanService';

export class BorrowerService {
  update = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $set: object });

  insert = ({ borrower = {}, userId }) =>
    Borrowers.insert({ ...borrower, userId });

  remove = ({ borrowerId }) => {
    LoanService.cleanupRemovedBorrower({ borrowerId });
    return Borrowers.remove(borrowerId);
  };

  pushValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $push: object });

  getBorrowerById = borrowerId => Borrowers.findOne(borrowerId);

  popValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pop: object });

  pullValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pull: object });
}

export default new BorrowerService();
