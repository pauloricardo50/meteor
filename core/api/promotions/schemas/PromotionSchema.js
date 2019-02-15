import SimpleSchema from 'simpl-schema';
import {
  PROMOTION_TYPES,
  PROMOTION_STATUS,
  PROMOTION_PERMISSIONS,
} from '../promotionConstants';
import {
  address,
  contactsSchema,
  userLinksSchema,
  createdAt,
  updatedAt,
} from '../../helpers/sharedSchemas';

const SCHEMA_BOOLEAN = { type: Boolean, optional: true, defaultValue: false };

export const promotionPermissionsSchema = {
  canViewPromotion: { type: Boolean, optional: true, defaultValue: true },
  canAddLots: SCHEMA_BOOLEAN,
  canModifyLots: SCHEMA_BOOLEAN,
  canRemoveLots: SCHEMA_BOOLEAN,
  canModifyPromotion: SCHEMA_BOOLEAN,
  canManageDocuments: SCHEMA_BOOLEAN,
  canSeeCustomers: SCHEMA_BOOLEAN,
  displayCustomerNames: {
    type: Object,
    optional: true,
    condition: ({ permissions }) => permissions && permissions.canSeeCustomers,
  },
  'displayCustomerNames.forLotStatus': {
    type: Array,
    optional: true,
    defaultValue: [],
    uniforms: { displayEmpty: false, placeholder: '', checkboxes: true },
  },
  'displayCustomerNames.forLotStatus.$': {
    type: String,
    allowedValues: Object.values(PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS),
  },
  'displayCustomerNames.invitedBy': {
    type: String,
    optional: true,
    allowedValues: Object.values(PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY),
    defaultValue:
      PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY.ORGANISATION,
    uniforms: { displayEmpty: false, placeholder: '' },
  },
  canInviteCustomers: SCHEMA_BOOLEAN,
  canBookLots: SCHEMA_BOOLEAN,
  // canPreBookLots: SCHEMA_BOOLEAN,
  canSellLots: SCHEMA_BOOLEAN,
};

const PromotionSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  name: { type: String, uniforms: { placeholder: 'Les Terrasses de Versoix' } },
  type: {
    type: String,
    allowedValues: Object.values(PROMOTION_TYPES),
    uniforms: { displayEmpty: false },
  },
  status: {
    type: String,
    allowedValues: Object.values(PROMOTION_STATUS),
    defaultValue: PROMOTION_STATUS.PREPARATION,
    uniforms: { displayEmpty: false },
  },
  ...address,
  ...contactsSchema,
  propertyLinks: { type: Array, defaultValue: [] },
  'propertyLinks.$': Object,
  'propertyLinks.$._id': { type: String, optional: true },
  lotLinks: { type: Array, defaultValue: [] },
  'lotLinks.$': Object,
  'lotLinks.$._id': { type: String, optional: true },
  promotionLotLinks: { type: Array, defaultValue: [] },
  'promotionLotLinks.$': Object,
  'promotionLotLinks.$._id': { type: String, optional: true },
  assignedEmployeeId: { type: String, optional: true },
  ...userLinksSchema(promotionPermissionsSchema),
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
