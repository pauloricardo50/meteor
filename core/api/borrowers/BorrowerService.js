import Borrowers from '../borrowers';
import UserService from '../users/UserService';

class BorrowerService {
  update = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $set: object });

  insert = ({ borrower, userId }) => Borrowers.insert({ ...borrower, userId });

  insertWithUserNames = ({ borrower, userId }) => {
    const { firstName, lastName } = UserService.getUserNames({ userId });

    if (firstName) {
      borrower.firstName = firstName;
    }

    if (lastName) {
      borrower.lastName = lastName;
    }

    return this.insert({ borrower, userId });
  };

  smartInsert = ({ borrower, userId }) => {
    const isFirstBorrowerForUser = Borrowers.find({ userId }).count() === 0;

    if (isFirstBorrowerForUser) {
      return this.insertWithUserNames({ borrower, userId });
    }

    return this.insert({ borrower, userId });
  };

  remove = ({ borrowerId }) => Borrowers.remove(borrowerId);

  pushValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $push: object });

  popValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pop: object });
}

export default new BorrowerService();
