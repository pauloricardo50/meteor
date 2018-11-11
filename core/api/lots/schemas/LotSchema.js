import SimpleSchema from 'simpl-schema';
import { LOT_TYPES } from '../lotConstants';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';

const LotSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  name: String,
  type: { type: String, allowedValues: Object.values(LOT_TYPES) },
  description: { type: String, optional: true },
  value: {
    type: Number,
    min: 0,
    max: 1000000000,
  },
});

export default LotSchema;
