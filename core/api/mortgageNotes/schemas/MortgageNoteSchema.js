import SimpleSchema from 'simpl-schema';

import {
  MORTGAGE_NOTE_CATEGORIES,
  MORTGAGE_NOTE_TYPES,
} from '../../helpers/sharedSchemaConstants';
import { createdAt, moneyField, updatedAt } from '../../helpers/sharedSchemas';
import { CANTONS } from '../../loans/loanConstants';

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
