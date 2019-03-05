import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { REVENUES_TYPES, REVENUES_STATUS } from '../revenueConstants';

const RevenueSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  approximation: { type: Boolean, defaultValue: true },
  amount: Number,
  type: {
    type: String,
    allowedValues: Object.values(REVENUES_TYPES),
  },
  description: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
    allowedValues: Object.values(REVENUES_STATUS),
  },
});

export default RevenueSchema;
