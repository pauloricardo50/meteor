import React from 'react';
import countries from 'i18n-iso-countries';
import SimpleSchema from 'simpl-schema';

import { CUSTOM_AUTOFIELD_TYPES } from '../../components/AutoForm2/autoFormConstants';
import {
  COMMON_COUNTRIES,
  getSortedCountriesCodes,
} from '../../utils/countriesUtils';
import zipcodes from '../../utils/zipcodes';
import { getCitiesFromZipCode } from '../gpsStats/methodDefinitions';
import { CANTONS } from '../loans/loanConstants';
import { autoValueSentenceCase } from './sharedSchemaValues';

export const createdAt = {
  type: Date,
  autoValue() {
    if (this.isInsert) {
      return new Date();
    }
    if (this.isUpdate) {
      return this.value;
    }
    this.unset();
  },
  optional: true,
  uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
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
  'additionalDocuments.$.tooltip': { type: String, optional: true },
});

export const address = {
  address1: {
    type: String,
    optional: true,
    autoValue: autoValueSentenceCase,
  },
  address2: {
    type: String,
    optional: true,
    autoValue: autoValueSentenceCase,
  },
  zipCode: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 1000,
    max: 99999,
  },
  city: {
    type: String,
    optional: true,
    autoValue: autoValueSentenceCase,
    customAllowedValues: ({ zipCode }) =>
      zipCode ? getCitiesFromZipCode.run({ zipCode }) : [null],
  },
  country: {
    type: String,
    optional: true,
    allowedValues: getSortedCountriesCodes(),
    defaultValue: 'CH',
    uniforms: {
      transform: code => {
        const name = countries.getName(code, 'fr');
        if (COMMON_COUNTRIES.includes(code)) {
          return <b>{name}</b>;
        }
        return countries.getName(code, 'fr');
      },
      displayEmtpy: false,
      placeholder: '',
    },
  },
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

const prefixSchemaKeys = (schema, prefix) =>
  Object.keys(schema).reduce(
    (keys, key) => ({ ...keys, [`${prefix}.${key}`]: schema[key] }),
    {},
  );

export const userLinksSchema = ({ metadataSchema, permissionsSchema }) => ({
  userLinks: { type: Array, defaultValue: [] },
  'userLinks.$': Object,
  'userLinks.$._id': { type: String, optional: true },
  ...(permissionsSchema
    ? makePermissions({ permissionsSchema, prefix: 'userLinks.$.permissions' })
    : {}),
  ...(metadataSchema ? prefixSchemaKeys(metadataSchema, 'userLinks.$') : {}),
});

export const mortgageNoteLinks = {
  mortgageNoteLinks: { type: Array, optional: true },
  'mortgageNoteLinks.$': Object,
  'mortgageNoteLinks.$._id': { type: String, optional: true },
};

export const roundedInteger = ({ digits, func = 'round', min }) => {
  const rounder = 10 ** digits;
  return {
    type: SimpleSchema.Integer,
    min: 0,
    max: 1000000000,
    autoValue() {
      if (this.isSet) {
        if (min && this.value <= min) {
          return;
        }

        return Math[func](this.value / rounder) * rounder;
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

export const decimalMoneyField = {
  ...moneyField,
  type: Number,
  uniforms: { type: CUSTOM_AUTOFIELD_TYPES.MONEY_DECIMAL },
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

export const cacheField = {
  type: Object,
  optional: true,
  blackbox: true,
};

export const decimalNegativeMoneyField = {
  ...moneyField,
  type: Number,
  min: -1000000000,
  uniforms: { type: CUSTOM_AUTOFIELD_TYPES.MONEY_NEGATIVE_DECIMAL },
};

export const negativeMoneyField = {
  ...moneyField,
  type: Number,
  min: -1000000000,
  uniforms: { type: CUSTOM_AUTOFIELD_TYPES.MONEY_NEGATIVE },
};

export const adminNotesSchema = {
  adminNotes: { type: Array, defaultValue: [] },
  'adminNotes.$': Object,
  'adminNotes.$.id': String,
  'adminNotes.$.note': {
    type: String,
    uniforms: { multiline: true, rows: 3 },
  },
  'adminNotes.$.date': { type: Date, defaultValue: new Date() },
  'adminNotes.$.updatedBy': String,
  'adminNotes.$.isSharedWithPros': { type: Boolean, defaultValue: false },
};
