import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt, moneyField } from '../../helpers/sharedSchemas';
import {
  CANTONS,
  MORTGAGE_NOTE_TYPES,
  MORTGAGE_NOTE_CATEGORIES,
} from '../../constants';

const MortgageNoteSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  value: moneyField,
  rank: { type: Number, min: 0, max: 10, optional: true },
  type: {
    type: String,
    allowedValues: Object.values(MORTGAGE_NOTE_TYPES),
    optional: true,
    uniforms: { placeholder: null },
  },
  category: {
    type: String,
    allowedValues: Object.values(MORTGAGE_NOTE_CATEGORIES),
    optional: true,
    uniforms: { placeholder: null },
  },
  canton: {
    type: String,
    allowedValues: Object.keys(CANTONS),
    optional: true,
    uniforms: { placeholder: null },
  },
});

export default MortgageNoteSchema;
