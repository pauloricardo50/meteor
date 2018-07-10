import Borrowers from '../borrowers';
import UserService from '../users/UserService';
import LoanService from '../loans/LoanService';

class BorrowerService {
  update = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $set: object });

  insert = ({ borrower, userId }) => Borrowers.insert({ ...borrower, userId });

  updateBorrowerNamesFromUser = ({ borrowerId, userId }) => {
    const { firstName, lastName } = UserService.getUserById({ userId });

    return this.update({ borrowerId, object: { firstName, lastName } });
  };

  smartInsert = ({ borrower, userId }) => {
    const newBorrowerId = this.insert({ borrower, userId });
    const newBorrowerLoans = LoanService.getLoansByBorrower({
      borrowerId: newBorrowerId,
    });
    // first borrower on a lon should take the user's names:
    // check if the new borrower is the first/ only borrower for any loans
    // and, if it is, update it's names from the corresponding user
    newBorrowerLoans.foreach(({ borrowerIds }) =>
      borrowerIds.length === 1 &&
        this.updateBorrowerNamesFromUser({ borrowerId: newBorrowerId, userId }));

    return newBorrowerId;
  };

  remove = ({ borrowerId }) => Borrowers.remove(borrowerId);

  pushValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $push: object });

  popValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pop: object });
}

export default new BorrowerService();
