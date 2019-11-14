import Borrowers from '../borrowers';
import LoanService from '../../loans/server/LoanService';
import CollectionService from '../../helpers/CollectionService';
import { fullBorrower } from '../../fragments';

export class BorrowerService extends CollectionService {
  constructor() {
    super(Borrowers);
    this.get = this.makeGet(fullBorrower());
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
      } else {
        // Only admins can remove a borrower that has multiple loans
        return Borrowers.remove(borrowerId);
      }
    } else {
      return Borrowers.remove(borrowerId);
    }
  };

  pushValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $push: object });

  popValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pop: object });

  pullValue = ({ borrowerId, object }) =>
    Borrowers.update(borrowerId, { $pull: object });

  getReusableBorrowers({ loanId, borrowerId }) {
    // borrowerId can be the previous removed borrower, and therefore
    // this line will fail if we don't provide a default empty object
    const { userId, loans } = this.get(borrowerId) || {};
    if (!userId) {
      return { borrowers: [], isLastLoan: true };
    }

    const userBorrowers = this.fetch({
      $filters: { userId },
      name: 1,
      loans: { name: 1 },
    });
    const loan = LoanService.findOne(loanId);
    const isLastLoan = loans && loans.length === 1 && loans[0]._id === loanId;

    const borrowersNotOnLoan = userBorrowers.filter(
      ({ _id }) => !loan.borrowerIds.includes(_id),
    );

    return { borrowers: borrowersNotOnLoan, isLastLoan };
  }

  cleanUpMortgageNotes({ borrowerId }) {
    const { mortgageNotes = [], loans = [] } = this.fetchOne({
      $filters: { _id: borrowerId },
      mortgageNotes: { _id: 1 },
      loans: { structures: 1 },
    });
    const borrowerMortgageNoteIds = mortgageNotes.map(({ _id }) => _id);

    loans.forEach(({ _id: loanId, structures = [] }) => {
      structures.forEach(({ id: structureId, mortgageNoteIds = [] }) => {
        LoanService.updateStructure({
          loanId,
          structureId,
          structure: {
            mortgageNoteIds: mortgageNoteIds.filter(
              id => !borrowerMortgageNoteIds.includes(id),
            ),
          },
        });
      });
    });
  }
}

export default new BorrowerService();
