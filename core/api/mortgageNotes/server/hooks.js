import BorrowerService from '../../borrowers/server/BorrowerService';
import MortgageNotes from '../mortgageNotes';
import MortgageNoteService from './MortgageNoteService';

MortgageNotes.before.remove((userId, { _id: mortgageNoteId }) => {
  const { borrower } = MortgageNoteService.get(mortgageNoteId, {
    borrower: { _id: 1 },
  });

  if (borrower) {
    BorrowerService.cleanUpMortgageNotes({ borrowerId: borrower._id });
  }
});
