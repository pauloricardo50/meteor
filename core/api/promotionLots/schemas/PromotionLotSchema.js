import SimpleSchema from 'simpl-schema';

import { cacheField, createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { PROMOTION_LOT_STATUS } from '../promotionLotConstants';

const PromotionLotSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  status: {
    type: String,
    allowedValues: Object.values(PROMOTION_LOT_STATUS),
    defaultValue: PROMOTION_LOT_STATUS.AVAILABLE,
  },
  propertyLinks: { type: Array, minCount: 1, maxCount: 1 },
  'propertyLinks.$': Object,
  'propertyLinks.$._id': { type: String, optional: true },
  lotLinks: { type: Array, defaultValue: [] },
  'lotLinks.$': Object,
  'lotLinks.$._id': { type: String, optional: true },
  attributedToLink: { type: Object, optional: true },
  'attributedToLink._id': { type: String, optional: true },
  // This should be a single object, instead of an array
  // https://github.com/Herteby/denormalize/issues/17
  promotionCache: { type: Array, optional: true },
  'promotionCache.$': cacheField,
});

export default PromotionLotSchema;
