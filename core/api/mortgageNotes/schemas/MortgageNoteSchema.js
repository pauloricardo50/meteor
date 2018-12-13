import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import {
  CANTONS,
  MORTGAGE_NOTE_TYPES,
  MORTGAGE_NOTE_CATEGORIES,
} from '../../constants';

const MortgageNoteSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  value: { type: Number, min: 0, max: 1000000000 },
  rank: { type: Number, min: 0, max: 10 },
  type: {
    type: String,
    allowedValues: Object.values(MORTGAGE_NOTE_TYPES),
  },
  category: {
    type: String,
    allowedValues: Object.values(MORTGAGE_NOTE_CATEGORIES),
  },
  canton: {
    type: String,
    allowedValues: Object.keys(CANTONS),
  },
});

export default MortgageNoteSchema;
