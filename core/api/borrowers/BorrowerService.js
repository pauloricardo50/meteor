import Borrowers from '.';
import { LoanService } from '../loans/LoanService';

export class BorrowerService {
  update = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $set: object });

  insert = ({ borrower = {}, userId }) =>
    Borrowers.insert({ ...borrower, userId });

  remove = ({ borrowerId }) => {
    LoanService.cleanupRemovedBorrower({ borrowerId });
    Borrowers.remove(borrowerId);
  };

  pushValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $push: object });

  getBorrowerById = borrowerId => Borrowers.findOne(borrowerId);

  popValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pop: object });
}

export default new BorrowerService();
