import Borrowers from '.';

export class BorrowerService {
  update = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $set: object });

  insert = ({ borrower = {}, userId }) =>
    Borrowers.insert({ ...borrower, userId });

  remove = ({ borrowerId }) => {
    Borrowers.remove(borrowerId);
  };

  pushValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $push: object });

  getBorrowerById = borrowerId => Borrowers.findOne(borrowerId);

  popValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pop: object });
}

export default new BorrowerService();
