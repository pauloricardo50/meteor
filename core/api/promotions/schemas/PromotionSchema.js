import SimpleSchema from 'simpl-schema';
import {
  PROMOTION_TYPES,
  PROMOTION_STATUS,
  PROMOTION_USER_PERMISSIONS,
} from '../promotionConstants';
import { address } from '../../helpers/sharedSchemas';

const PromotionSchema = new SimpleSchema({
  name: { type: String },
  type: { type: String, allowedValues: Object.values(PROMOTION_TYPES) },
  status: {
    type: String,
    allowedValues: Object.values(PROMOTION_STATUS),
    defaultValue: PROMOTION_STATUS.PREPARATION,
  },
  ...address,
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
  userLinks: [Object],
  'userLinks.$._id': String,
  'userLinks.$.permissions': {
    type: String,
    allowedValues: Object.values(PROMOTION_USER_PERMISSIONS),
  },
});

export const BasePromotionSchema = PromotionSchema.pick(
  'name',
  'type',
  'address1',
  'address2',
  'zipCode',
  'city',
);

export default PromotionSchema;
