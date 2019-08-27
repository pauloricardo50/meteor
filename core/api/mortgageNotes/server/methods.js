import SecurityService from '../../security';
import {
  mortgageNoteInsert,
  mortgageNoteRemove,
  mortgageNoteUpdate,
} from '../methodDefinitions';
import MortgageNoteService from './MortgageNoteService';

mortgageNoteInsert.setHandler(({ userId }, params) => {
  if (params.propertyId) {
    SecurityService.properties.isAllowedToUpdate(params.propertyId, userId);
  }
  if (params.borrowerId) {
    SecurityService.borrowers.isAllowedToUpdate(params.borrowerId, userId);
  }
  MortgageNoteService.insert(params);
});

mortgageNoteRemove.setHandler(({ userId }, { mortgageNoteId }) => {
  const { borrower, property } = MortgageNoteService.fetchOne({
    $filters: { _id: mortgageNoteId },
  });
  if (property) {
    SecurityService.properties.isAllowedToUpdate(property._id, userId);
  }
  if (borrower) {
    SecurityService.borrowers.isAllowedToUpdate(borrower._id, userId);
  }

  return MortgageNoteService.remove(mortgageNoteId);
});

mortgageNoteUpdate.setHandler(({ userId }, { mortgageNoteId, object }) => {
  const { borrower, property } = MortgageNoteService.fetchOne({
    $filters: { _id: mortgageNoteId },
    borrower: { _id: 1 },
    property: { _id: 1 },
  });
  if (property) {
    SecurityService.properties.isAllowedToUpdate(property._id, userId);
  }
  if (borrower) {
    SecurityService.borrowers.isAllowedToUpdate(borrower._id, userId);
  }

  return MortgageNoteService._update({ id: mortgageNoteId, object });
});
