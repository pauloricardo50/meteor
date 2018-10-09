import SimpleSchema from 'simpl-schema';
import { PROMOTION_LOT_STATUS } from '../promotionLotConstants';

const PromotionLotSchema = new SimpleSchema({
  status: {
    type: String,
    allowedValues: Object.values(PROMOTION_LOT_STATUS),
  },
  propertyLinks: [Object],
  'propertyLinks.$._id': String,
  lotLinks: [Object],
  'lotLinks.$._id': String,
});

export default PromotionLotSchema;
