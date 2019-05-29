import SimpleSchema from 'simpl-schema';

import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { CANTONS } from '../loans/loanConstants';
import zipcodes from '../../utils/zipcodes';

export const createdAt = {
  type: Date,
  autoValue() {
    if (this.isInsert) {
      return new Date();
    }
    this.unset();
  },
  optional: true,
};

export const updatedAt = {
  type: Date,
  autoValue() {
    if (this.isUpdate || this.isInsert || this.isUpsert) {
      return new Date();
    }
  },
  optional: true,
};

export const additionalDocuments = initialDocuments => ({
  additionalDocuments: { type: Array, defaultValue: initialDocuments },
  'additionalDocuments.$': Object,
  'additionalDocuments.$.id': String,
  'additionalDocuments.$.label': { type: String, optional: true },
  'additionalDocuments.$.requiredByAdmin': { type: Boolean, optional: true },
  'additionalDocuments.$.category': { type: String, optional: true },
});

export const address = {
  address1: { type: String, optional: true },
  address2: { type: String, optional: true },
  zipCode: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 1000,
    max: 99999,
  },
  city: { type: String, optional: true },
  canton: {
    type: String,
    allowedValues: Object.keys(CANTONS),
    optional: true,
    autoValue() {
      return zipcodes(this.field('zipCode').value);
    },
    uniforms: { placeholder: null },
  },
};

export const contactsSchema = {
  contacts: { type: Array, defaultValue: [] },
  'contacts.$': Object,
  'contacts.$.name': { type: String, uniforms: { label: 'Prénom Nom' } },
  'contacts.$.title': { type: String, uniforms: { label: 'Fonction/Titre' } },
  'contacts.$.email': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  'contacts.$.phoneNumber': {
    type: String,
    uniforms: { label: 'No. de Téléphone' },
    optional: true,
  },
};

export const makePermissions = ({
  permissionsSchema,
  prefix,
  autoFormDisplayCondition = () => true,
  autoFormLabel,
}) =>
  Object.keys(permissionsSchema).reduce(
    (permissions, key) => ({
      ...permissions,
      [`${prefix}.${key}`]: permissionsSchema[key],
    }),
    {
      [prefix]: {
        type: Object,
        optional: true,
        condition: autoFormDisplayCondition,
        uniforms: { label: autoFormLabel || prefix },
      },
    },
  );

export const userLinksSchema = permissionsSchema => ({
  userLinks: { type: Array, defaultValue: [] },
  'userLinks.$': Object,
  'userLinks.$._id': { type: String, optional: true },
  ...(permissionsSchema
    ? makePermissions({ permissionsSchema, prefix: 'userLinks.$.permissions' })
    : {}),
});

export const mortgageNoteLinks = {
  mortgageNoteLinks: { type: Array, optional: true },
  'mortgageNoteLinks.$': Object,
  'mortgageNoteLinks.$._id': { type: String, optional: true },
};

export const roundedInteger = (digits) => {
  const rounder = 10 ** digits;
  return {
    type: SimpleSchema.Integer,
    min: 0,
    max: 1000000000,
    autoValue() {
      if (this.isSet) {
        return Math.round(this.value / rounder) * rounder;
      }
    },
    optional: true,
  };
};

export const percentageField = {
  type: Number,
  min: -1,
  max: 1,
  optional: true,
  autoValue() {
    if (this.isSet) {
      return Math.round(Number(this.value) * 10000) / 10000;
    }
  },
  uniforms: { type: CUSTOM_AUTOFIELD_TYPES.PERCENT, placeholder: '0.00%' },
};

export const moneyField = {
  type: SimpleSchema.Integer,
  min: 0,
  max: 1000000000,
  optional: true,
  uniforms: { type: CUSTOM_AUTOFIELD_TYPES.MONEY },
};

export const documentsField = {
  type: Object,
  defaultValue: {},
  optional: true,
  blackbox: true,
};

export const dateField = {
  type: Date,
  optional: true,
  uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
};
