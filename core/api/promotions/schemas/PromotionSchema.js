import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import {
  PROMOTION_TYPES,
  PROMOTION_STATUS,
  PROMOTION_PERMISSIONS,
  PROMOTION_AUTHORIZATION_STATUS,
} from '../promotionConstants';
import {
  address,
  contactsSchema,
  userLinksSchema,
  createdAt,
  updatedAt,
  documentsField,
  percentageField,
  dateField,
} from '../../helpers/sharedSchemas';

const SCHEMA_BOOLEAN = { type: Boolean, optional: true, defaultValue: false };

export const promotionPermissionsSchema = {
  canAddLots: SCHEMA_BOOLEAN,
  canModifyLots: SCHEMA_BOOLEAN,
  canRemoveLots: SCHEMA_BOOLEAN,
  canModifyPromotion: SCHEMA_BOOLEAN,
  canManageDocuments: SCHEMA_BOOLEAN,
  displayCustomerNames: {
    type: SimpleSchema.oneOf(Boolean, Object),
    optional: true,
    autoValue() {
      if (Meteor.isServer && this.isSet) {
        if (this.value === undefined) {
          return false;
        }

        if (this.value instanceof Object) {
          if (!Object.keys(this.value).length) {
            return false;
          }

          if (!this.value.invitedBy) {
            return false;
          }
        }

        return this.value;
      }
    },
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
    uniforms: { displayEmpty: false, placeholder: '' },
  },
  canInviteCustomers: SCHEMA_BOOLEAN,
  canBookLots: SCHEMA_BOOLEAN,
  // canPreBookLots: SCHEMA_BOOLEAN,
  canSellLots: SCHEMA_BOOLEAN,
  canSeeManagement: SCHEMA_BOOLEAN,
};

SimpleSchema.setDefaultMessages({
  messages: {
    fr: { incompleteTimeline: "Les pourcentages doivent s'additionner à 100%" },
  },
});

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
  zipCode: { ...address.zipCode, optional: false },
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
  ...userLinksSchema({
    permissionsSchema: promotionPermissionsSchema,
    metadataSchema: {
      enableNotifications: {
        type: Boolean,
        defaultValue: true,
        optional: true,
      },
    },
  }),
  documents: documentsField,
  lenderOrganisationLink: { type: Object, optional: true },
  'lenderOrganisationLink._id': { type: String, optional: true },
  signingDate: dateField,
  constructionTimeline: {
    type: Array,
    defaultValue: [],
    custom() {
      if (this.value.length === 0) {
        return;
      }

      // Round up to 100 to avoid JS math rounding issues
      if (
        Math.round(this.value.reduce((tot, { percent }) => tot + percent, 0) * 100) !== 100
      ) {
        return 'incompleteTimeline';
      }
    },
  },
  'constructionTimeline.$': Object,
  'constructionTimeline.$.description': String,
  'constructionTimeline.$.duration': {
    type: Number,
    uniforms: { placeholder: null },
  },
  'constructionTimeline.$.percent': { ...percentageField, optional: false },
  adminNote: { type: String, optional: true },
  projectStatus: { type: String, optional: true },
  authorizationStatus: {
    type: String,
    allowedValues: Object.values(PROMOTION_AUTHORIZATION_STATUS),
    optional: true,
    defaultValue: PROMOTION_AUTHORIZATION_STATUS.NONE,
    uniforms: {
      displayEmpty: false,
      placeholder: '',
    },
  },
  agreementDuration: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 30,
  },
});

export const BasePromotionSchema = PromotionSchema.pick(
  'name',
  'type',
  'address1',
  'address2',
  'zipCode',
  'city',
  'signingDate',
  'contacts',
  'agreementDuration',
);

export default PromotionSchema;
