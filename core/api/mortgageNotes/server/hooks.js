import BorrowerService from '../../borrowers/server/BorrowerService';
import MortgageNotes from '../mortgageNotes';
import MortgageNoteService from './MortgageNoteService';

MortgageNotes.before.remove((userId, { _id: mortgageNoteId }) => {
  const { borrower } = MortgageNoteService.fetchOne({
    $filters: { _id: mortgageNoteId },
    borrower: { _id: 1 },
  });

  if (borrower) {
    BorrowerService.cleanUpMortgageNotes({ borrowerId: borrower._id });
  }
});
