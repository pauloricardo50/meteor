import Borrowers from '.';
import LoanService from '../loans/LoanService';
import CollectionService from '../helpers/CollectionService';
import { loanBorrowerFragment } from './queries/borrowerFragments';

export class BorrowerService extends CollectionService {
  constructor() {
    super(Borrowers);
  }

  get(borrowerId) {
    return this.collection
      .createQuery({
        $filters: { _id: borrowerId },
        ...loanBorrowerFragment,
      })
      .fetchOne();
  }

  update = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $set: object });

  insert = ({ borrower = {}, userId }) =>
    Borrowers.insert({ ...borrower, userId });

  remove = ({ borrowerId, loanId }) => {
    LoanService.cleanupRemovedBorrower({ borrowerId });
    const borrower = this.get(borrowerId);
    if (borrower.loans && borrower.loans.length > 1) {
      const loansLink = this.getLink(borrowerId, 'loans');
      if (loanId) {
        // Fix this conditional when the issue has been dealt with
        // https://github.com/cult-of-coders/grapher/issues/332
        loansLink.remove(loanId);
      }
    } else {
      return Borrowers.remove(borrowerId);
    }
  };

  pushValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $push: object });

  getBorrowerById = borrowerId => Borrowers.findOne(borrowerId);

  popValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pop: object });

  pullValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pull: object });

  getReusableBorrowers({ userId, loanId, borrowerId }) {
    const userBorrowers = this.createQuery({
      $filters: { userId },
      name: 1,
      loans: { name: 1 },
    }).fetch();
    const loan = LoanService.get(loanId);
    const borrower = this.get(borrowerId);
    const isLastLoan = borrower.loans
      && borrower.loans.length === 1
      && borrower.loans[0]._id === loanId;

    const borrowersNotOnLoan = userBorrowers.filter(({ _id }) => !loan.borrowerIds.includes(_id));

    return { borrowers: borrowersNotOnLoan, isLastLoan };
  }
}

export default new BorrowerService();
