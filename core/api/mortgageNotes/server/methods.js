import SecurityService from '../../security';
import MortgageNoteService from '../MortgageNoteService';
import {
  mortgageNoteInsert,
  mortgageNoteRemove,
  mortgageNoteUpdate,
} from '../methodDefinitions';

mortgageNoteInsert.setHandler((context, { mortgageNotes }) =>
  // Add security checks
  // Example
  // SecurityService.checkCurrentUserIsAdmin();
  MortgageNoteService.insert(mortgageNotes));

mortgageNoteRemove.setHandler((context, { mortgageNotesId }) =>
  // Add security checks
  // Example
  // SecurityService.checkCurrentUserIsAdmin();
  MortgageNoteService.remove(mortgageNotesId));

mortgageNoteUpdate.setHandler((context, { mortgageNotesId, object }) =>
  // Add security checks
  // Example
  // SecurityService.checkCurrentUserIsAdmin();
  MortgageNoteService._update({ id: mortgageNotesId, object }));
