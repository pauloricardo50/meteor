import BorrowerService from '../../borrowers/server/BorrowerService';
import MortgageNotes from '../mortgageNotes';
import MortgageNoteService from './MortgageNoteService';

MortgageNotes.before.remove((userId, { _id: mortgageNoteId }) => {
  const { borrowers = [] } = MortgageNoteService.createQuery({
    $filters: { _id: mortgageNoteId },
    borrowers: { _id: 1 },
  }).fetchOne();

  borrowers.forEach(({ _id: borrowerId }) => {
    BorrowerService.cleanUpMortgageNotes({ borrowerId });
  });
});
