import { Mongo } from 'meteor/mongo';

import MortgageNotesSchema from './schemas/mortgageNotesSchema';
import { MORTGAGE_NOTES_COLLECTION } from './mortgageNoteConstants';

const MortgageNotes = new Mongo.Collection(MORTGAGE_NOTES_COLLECTION);

MortgageNotes.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

MortgageNotes.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

MortgageNotes.attachSchema(MortgageNotesSchema);
export default MortgageNotes;
