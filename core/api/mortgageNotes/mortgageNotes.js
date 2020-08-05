import { createCollection } from '../helpers/collectionHelpers';
import { MORTGAGE_NOTES_COLLECTION } from './mortgageNoteConstants';
import MortgageNoteSchema from './schemas/MortgageNoteSchema';

const MortgageNotes = createCollection(
  MORTGAGE_NOTES_COLLECTION,
  MortgageNoteSchema,
);

export default MortgageNotes;
