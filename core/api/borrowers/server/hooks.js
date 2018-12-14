import { additionalDocumentsHook } from '../../helpers/sharedHooks';
import Borrowers from '../borrowers';
import { BORROWERS_COLLECTION } from '../borrowerConstants';
import {
  initialDocuments,
  conditionalDocuments,
} from '../borrowersAdditionalDocuments';
import BorrowerService from '../BorrowerService';
import LoanService from '../../loans/LoanService';

Borrowers.after.insert(additionalDocumentsHook({
  collection: BORROWERS_COLLECTION,
  initialDocuments,
  conditionalDocuments,
}));

Borrowers.after.update(additionalDocumentsHook({
  collection: BORROWERS_COLLECTION,
  initialDocuments,
  conditionalDocuments,
}));

// Clean up mortgagenotes from all structures that come from this borrower
Borrowers.before.remove((userId, { _id: borrowerId }) => {
  const { mortgageNotes = [], loans = [] } = BorrowerService.createQuery({
    $filters: { _id: borrowerId },
    mortgageNotes: { _id: 1 },
    loans: { structures: 1 },
  }).fetch();
  const borrowerMortgageNoteIds = mortgageNotes.map(({ _id }) => _id);

  loans.forEach(({ _id: loanId, structures = [] }) => {
    structures.forEach(({ id: structureId, mortgageNoteIds }) => {
      LoanService.updateStructure({
        loanId,
        structureId,
        structure: {
          mortgageNoteIds: mortgageNoteIds.filter(id => !borrowerMortgageNoteIds.includes(id)),
        },
      });
    });
  });
});
