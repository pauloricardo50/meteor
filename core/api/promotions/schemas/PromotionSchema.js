import SimpleSchema from 'simpl-schema';
import { PROMOTION_TYPES, PROMOTION_STATUS } from '../promotionConstants';
import {
  address,
  contactsSchema,
  userLinksSchema,
  createdAt,
  updatedAt,
} from '../../helpers/sharedSchemas';

const PromotionSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  name: { type: String },
  type: { type: String, allowedValues: Object.values(PROMOTION_TYPES) },
  status: {
    type: String,
    allowedValues: Object.values(PROMOTION_STATUS),
    defaultValue: PROMOTION_STATUS.PREPARATION,
  },
  ...address,
  ...contactsSchema,
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
  ...userLinksSchema,
});

export const BasePromotionSchema = PromotionSchema.pick(
  'name',
  'type',
  'address1',
  'address2',
  'zipCode',
  'city',
  'contacts',
);

export default PromotionSchema;
