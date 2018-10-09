import SimpleSchema from 'simpl-schema';
import {
  PROMOTION_TYPES,
  PROMOTION_STATUS,
  PROMOTION_USER_PERMISSIONS,
} from '../promotionConstants';

const PromotionSchema = new SimpleSchema({
  name: { type: String },
  type: { type: String, allowedValues: Object.values(PROMOTION_TYPES) },
  status: { type: String, allowedValues: Object.values(PROMOTION_STATUS) },
  address1: { type: String, optional: true },
  address2: { type: String, optional: true },
  zipCode: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 1000,
    max: 9999,
  },
  city: { type: String, optional: true },
  propertyLinks: { type: Array, defaultValue: [] },
  'propertyLinks.$': Object,
  'propertyLinks.$._id': String,
  'propertyLinks.$.propertyWork': { type: Array, optional: true },
  'propertyLinks.$.propertyWork.$': Object,
  'propertyLinks.$.propertyWork.$.description': String,
  'propertyLinks.$.propertyWork.$.value': Number,
  lotLinks: { type: Array, defaultValue: [] },
  'lotLinks.$': Object,
  'lotLinks.$._id': String,
  promotionLotLinks: { type: Array, defaultValue: [] },
  'promotionLotLinks.$': Object,
  'promotionLotLinks.$._id': String,
  'promotionLotLinks.$.attributedTo': { type: String, optional: true },
  userLinks: [Object],
  'userLinks.$._id': String,
  'userLinks.$.permissions': {
    type: String,
    allowedValues: Object.values(PROMOTION_USER_PERMISSIONS),
  },
});

export default PromotionSchema;
