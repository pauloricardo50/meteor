import SimpleSchema from 'simpl-schema';
import { PROMOTION_OPTION_STATUS } from '../promotionOptionConstants';

const PromotionOptionSchema = new SimpleSchema({
  promotionLotLinks: { type: Array, defaultValue: [] },
  'promotionLotLinks.$': Object,
  'promotionLotLinks.$._id': String,
  lotLinks: { type: Array, optional: true },
  'lotLinks.$': Object,
  'lotLinks.$._id': String,
  status: {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_STATUS),
  },
});

export default PromotionOptionSchema;
