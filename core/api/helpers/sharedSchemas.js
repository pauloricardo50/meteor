import SimpleSchema from 'simpl-schema';

import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { DOCUMENT_USER_PERMISSIONS } from '../constants';
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
    if (this.isUpdate) {
      return new Date();
    }
  },
  denyInsert: true,
  optional: true,
};

export const additionalDocuments = initialDocuments => ({
  additionalDocuments: { type: Array, defaultValue: initialDocuments },
  'additionalDocuments.$': Object,
  'additionalDocuments.$.id': String,
  'additionalDocuments.$.label': { type: String, optional: true },
  'additionalDocuments.$.requiredByAdmin': { type: Boolean, optional: true },
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

export const userLinksSchema = {
  userLinks: { type: Array, defaultValue: [] },
  'userLinks.$': Object,
  'userLinks.$._id': { type: String, optional: true },
  'userLinks.$.permissions': {
    type: String,
    allowedValues: Object.values(DOCUMENT_USER_PERMISSIONS),
  },
};

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
  min: 0,
  max: 1,
  optional: true,
  autoValue() {
    if (this.isSet) {
      return Math.floor(Number(this.value) * 10000) / 10000;
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
