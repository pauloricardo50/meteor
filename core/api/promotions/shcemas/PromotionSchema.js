import SimpleSchema from 'simpl-schema';
import { PROMOTION_TYPES, PROMOTION_STATUS } from '../promotionConstants';

const PromotionSchema = new SimpleSchema({
  name: {
    type: String,
  },
  type: {
    type: String,
    allowedValues: Object.values(PROMOTION_TYPES),
  },
  status: {
    type: String,
    allowedValues: Object.values(PROMOTION_STATUS),
  },
  address1: {
    type: String,
    optional: true,
  },
  address2: {
    type: String,
    optional: true,
  },
  zipCode: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 1000,
    max: 9999,
  },
  city: {
    type: String,
    optional: true,
  },
});

export default PromotionSchema;
