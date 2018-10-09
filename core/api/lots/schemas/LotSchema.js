import SimpleSchema from 'simpl-schema';
import { LOT_TYPES } from '../lotConstants';

const LotSchema = new SimpleSchema({
  name: String,
  type: { type: String, allowedValues: Object.values(LOT_TYPES) },
  description: { type: String, optional: true },
  value: {
    type: Number,
    min: 1,
    max: 1000000000,
  },
});

export default LotSchema;
