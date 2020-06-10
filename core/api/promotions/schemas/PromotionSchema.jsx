import { Meteor } from 'meteor/meteor';

import React from 'react';
import SimpleSchema from 'simpl-schema';

import T from '../../../components/Translation';
import {
  address,
  contactsSchema,
  createdAt,
  dateField,
  documentsField,
  percentageField,
  updatedAt,
  userLinksSchema,
} from '../../helpers/sharedSchemas';
import { autoValueSentenceCase } from '../../helpers/sharedSchemaValues';
import {
  PROMOTION_AUTHORIZATION_STATUS,
  PROMOTION_PERMISSIONS,
  PROMOTION_STATUS,
  PROMOTION_TYPES,
  PROMOTION_USERS_ROLES,
} from '../promotionConstants';

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
      if (Meteor.isServer) {
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
    allowedValues: Object.values(
      PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.FOR_LOT_STATUS,
    ),
  },
  'displayCustomerNames.invitedBy': {
    type: String,
    optional: true,
    allowedValues: Object.values(
      PROMOTION_PERMISSIONS.DISPLAY_CUSTOMER_NAMES.INVITED_BY,
    ),
    uniforms: { displayEmpty: false, placeholder: '' },
  },
  canInviteCustomers: SCHEMA_BOOLEAN,
  canReserveLots: SCHEMA_BOOLEAN,
  canSeeManagement: SCHEMA_BOOLEAN,
};

const constructionTimelineSchema = {
  startPercent: percentageField,
  steps: { type: Array, defaultValue: [] },
  'steps.$': Object,
  'steps.$.description': String,
  'steps.$.startDate': { ...dateField, optional: false },
  'steps.$.percent': { ...percentageField, optional: false },
  endDate: dateField,
  endPercent: percentageField,
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
      roles: {
        type: Array,
        optional: true,
        defaultValue: [PROMOTION_USERS_ROLES.BROKER],
      },
      'roles.$': {
        type: String,
        allowedValues: Object.values(PROMOTION_USERS_ROLES),
        optional: true,
      },
    },
  }),
  documents: documentsField,
  lenderOrganisationLink: { type: Object, optional: true },
  'lenderOrganisationLink._id': { type: String, optional: true },
  signingDate: dateField,
  constructionTimeline: {
    optional: true,
    defaultValue: {},
    type: new SimpleSchema(constructionTimelineSchema),
  },
  // constructionTimeline: {
  //   type: Array,
  //   defaultValue: [],
  //   custom() {
  //     if (this.value.length === 0) {
  //       return;
  //     }

  //     // Round up to 100 to avoid JS math rounding issues
  //     if (
  //       Math.round(
  //         this.value.reduce((tot, { percent }) => tot + percent, 0) * 100,
  //       ) !== 100
  //     ) {
  //       return 'incompleteTimeline';
  //     }
  //   },
  // },
  // 'constructionTimeline.$': Object,
  // 'constructionTimeline.$.description': String,
  // 'constructionTimeline.$.duration': {
  //   type: Number,
  //   uniforms: { placeholder: null },
  // },
  // 'constructionTimeline.$.percent': { ...percentageField, optional: false },
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
  isTest: {
    type: Boolean,
    defaultValue: false,
    uniforms: { label: 'Promotion test' },
  },
  description: {
    type: String,
    optional: true,
    uniforms: { placeholder: null, multiline: true, rows: 5, rowsMax: 15 },
    autoValue: autoValueSentenceCase,
  },
  externalUrl: {
    type: String,
    optional: true,
    uniforms: {
      label: <T id="Forms.promotionExternalUrl" />,
      placeholder: 'https://www.google.com/ma-promotion',
    },
  },
  promotionLotGroups: {
    type: Array,
    optional: true,
  },
  'promotionLotGroups.$': Object,
  'promotionLotGroups.$.id': String,
  'promotionLotGroups.$.label': String,
});

export const BasePromotionSchema = PromotionSchema.pick(
  'address1',
  'address2',
  'agreementDuration',
  'city',
  'contacts',
  'description',
  'externalUrl',
  'isTest',
  'name',
  'signingDate',
  'type',
  'zipCode',
);

export const basePromotionLayout = [
  {
    layout: [
      'isTest',
      {
        className: 'grid-col',
        fields: ['name', 'type'],
      },
      {
        className: 'grid-row',
        fields: ['description', 'externalUrl'],
      },
    ],
    className: 'mb-32 grid-row',
  },
  {
    layout: [
      { className: 'grid-col', fields: ['address1', 'address2'] },
      { className: 'grid-col', fields: ['zipCode', 'city'] },
      'agreementDuration',
      'signingDate',
    ],
    className: 'mb-32 grid-row',
  },
  'contacts',
];

export default PromotionSchema;
