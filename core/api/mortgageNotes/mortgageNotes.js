import { Mongo } from 'meteor/mongo';

import MortgageNoteSchema from './schemas/MortgageNoteSchema';
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

MortgageNotes.attachSchema(MortgageNoteSchema);
export default MortgageNotes;
