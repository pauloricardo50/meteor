import Borrowers from '.';
import LoanService from '../loans/LoanService';
import CollectionService from '../helpers/CollectionService';

export class BorrowerService extends CollectionService {
  constructor() {
    super(Borrowers);
  }

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
