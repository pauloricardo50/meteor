import SecurityService from '../../security';
import {
  mortgageNoteInsert,
  mortgageNoteRemove,
  mortgageNoteUpdate,
} from '../methodDefinitions';
import MortgageNoteService from './MortgageNoteService';

mortgageNoteInsert.setHandler((context, params) => {
  if (params.propertyId) {
    SecurityService.properties.isAllowedToUpdate(params.propertyId);
  }
  if (params.borrowerId) {
    SecurityService.borrowers.isAllowedToUpdate(params.borrowerId);
  }
  MortgageNoteService.insert(params);
});

mortgageNoteRemove.setHandler((context, { mortgageNoteId }) =>
  // Add security checks
  // Example
  // SecurityService.checkCurrentUserIsAdmin();
  MortgageNoteService.remove(mortgageNoteId));

mortgageNoteUpdate.setHandler((context, { mortgageNoteId, object }) =>
  // Add security checks
  // Example
  // SecurityService.checkCurrentUserIsAdmin();
  MortgageNoteService._update({ id: mortgageNoteId, object }));
