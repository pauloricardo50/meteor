import MortgageNoteSchema from './schemas/MortgageNoteSchema';
import { MORTGAGE_NOTES_COLLECTION } from './mortgageNoteConstants';
import { createCollection } from '../helpers/collectionHelpers';

const MortgageNotes = createCollection(MORTGAGE_NOTES_COLLECTION);

MortgageNotes.attachSchema(MortgageNoteSchema);
export default MortgageNotes;
