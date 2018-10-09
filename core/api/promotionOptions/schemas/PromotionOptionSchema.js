import SimpleSchema from 'simpl-schema';
import { PROMOTION_OPTION_STATUS } from '../promotionOptionConstants';

const PromotionOptionSchema = new SimpleSchema({
  promotionLotLinks: [Object],
  'promotionLotLinks.$._id': String,
  lotsOverride: { type: Array, optional: true },
  'lotsOverride.$': Object,
  'lotsOverride.$._id': String,
  status: {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_STATUS),
  },
});

export default PromotionOptionSchema;
