import SimpleSchema from 'simpl-schema';

import { createdAt, moneyField, updatedAt } from '../../helpers/sharedSchemas';
import { LOT_TYPES } from '../lotConstants';

const LotSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  name: String,
  type: {
    type: String,
    allowedValues: Object.values(LOT_TYPES),
    uniforms: { displayEmpty: false },
  },
  description: { type: String, optional: true },
  value: {
    ...moneyField,
    optional: false,
  },
});

export default LotSchema;
