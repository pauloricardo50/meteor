import SimpleSchema from 'simpl-schema';
import { PROMOTION_LOT_STATUS } from '../promotionLotConstants';
import {
  createdAt,
  updatedAt,
} from '../../helpers/sharedSchemas';

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
});

export default PromotionLotSchema;
