import SimpleSchema from 'simpl-schema';

import {
  percentageField,
  moneyField,
  address,
} from '../../helpers/sharedSchemas';
import { autoValueSentenceCase } from '../../helpers/sharedSchemaValues';

import {
  RESIDENCY_PERMIT,
  GENDER,
  CIVIL_STATUS,
  OTHER_INCOME,
  EXPENSES,
  OWN_FUNDS_TYPES,
  BORROWER_ACTIVITY_TYPES,
} from '../borrowerConstants';
import { RESIDENCE_TYPE } from '../../constants';
import { CUSTOM_AUTOFIELD_TYPES } from '../../../components/AutoForm2/constants';

const makeArrayOfObjectsSchema = (name, allowedValues) => ({
  [name]: { type: Array, defaultValue: [], optional: true },
  [`${name}.$`]: Object,
  [`${name}.$.value`]: {
    ...moneyField,
    optional: false,
  },
  [`${name}.$.description`]: {
    type: String,
    optional: true,
    allowedValues,
    uniforms: {
      displayEmpty: false,
      intlId: `${name}.description`,
      allowedValuesIntlId: name,
    },
  },
});

export const personalInfoSchema = {
  firstName: {
    type: String,
    optional: true,
    autoValue: autoValueSentenceCase,
  },
  lastName: {
    type: String,
    optional: true,
    autoValue: autoValueSentenceCase,
  },
  gender: {
    type: String,
    optional: true,
    allowedValues: Object.values(GENDER),
    uniforms: { displayEmpty: false },
  },
  birthDate: {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  ...Object.keys(address).reduce(
    (addressObject, key) => ({
      ...addressObject,
      [key]: { ...address[key], condition: ({ sameAddress }) => !sameAddress },
    }),
    {},
  ),
  sameAddress: {
    type: Boolean,
    optional: true,
    uniforms: {
      type: CUSTOM_AUTOFIELD_TYPES.BOOLEAN_RADIO,
    },
  },
  isSwiss: {
    type: Boolean,
    optional: true,
    uniforms: {
      type: CUSTOM_AUTOFIELD_TYPES.BOOLEAN_RADIO,
    },
  },
  residencyPermit: {
    type: String,
    optional: true,
    allowedValues: Object.values(RESIDENCY_PERMIT),
    uniforms: { displayEmpty: false },
    condition: ({ isSwiss }) => !isSwiss,
  },
  citizenship: {
    type: String,
    optional: true,
    condition: ({ isSwiss }) => !isSwiss,
  },
  isUSPerson: {
    type: Boolean,
    optional: true,
    uniforms: {
      type: CUSTOM_AUTOFIELD_TYPES.BOOLEAN_RADIO,
    },
  },
  civilStatus: {
    type: String,
    allowedValues: Object.values(CIVIL_STATUS),
    optional: true,
    uniforms: { displayEmpty: false },
  },
  marriedDate: {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
    condition: ({ civilStatus }) => civilStatus === CIVIL_STATUS.MARRIED,
  },
  divorcedDate: {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
    condition: ({ civilStatus }) => civilStatus === CIVIL_STATUS.DIVORCED,
  },
  childrenCount: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
    max: 20,
  },
  company: {
    type: String,
    optional: true,
    condition: ({ activityType }) =>
      activityType === BORROWER_ACTIVITY_TYPES.SALARIED,
  },
  worksInSwitzerlandSince: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 1900,
    max: 2050,
    condition: ({ activityType }) =>
      activityType === BORROWER_ACTIVITY_TYPES.SALARIED,
  },
  job: {
    type: String,
    optional: true,
    condition: ({ activityType }) =>
      [
        BORROWER_ACTIVITY_TYPES.SALARIED,
        BORROWER_ACTIVITY_TYPES.SELF_EMPLOYED,
      ].includes(activityType),
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  phoneNumber: { type: String, optional: true },
  jobStartDate: {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
    condition: ({ activityType }) =>
      activityType === BORROWER_ACTIVITY_TYPES.SALARIED,
  },
  jobActivityRate: {
    ...percentageField,
    condition: ({ activityType }) =>
      activityType === BORROWER_ACTIVITY_TYPES.SALARIED,
  },
  activityType: {
    type: String,
    optional: true,
    allowedValues: Object.values(BORROWER_ACTIVITY_TYPES),
    uniforms: { displayEmpty: false },
  },
  selfEmployedSince: {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
    condition: ({ activityType }) =>
      activityType === BORROWER_ACTIVITY_TYPES.SELF_EMPLOYED,
  },
  annuitantSince: {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
    condition: ({ activityType }) =>
      activityType === BORROWER_ACTIVITY_TYPES.ANNUITANT,
  },
};

const bonusField = {
  ...moneyField,
  condition: ({ bonusExists }) => !!bonusExists,
};

export const financeInfoSchema = {
  salary: moneyField,
  netSalary: moneyField,
  bonusExists: {
    type: Boolean,
    optional: true,
    uniforms: {
      type: CUSTOM_AUTOFIELD_TYPES.BOOLEAN_RADIO,
    },
  },
  bonus2015: bonusField,
  bonus2016: bonusField,
  bonus2017: bonusField,
  bonus2018: bonusField,
  bonus2019: bonusField,
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.BANK_FORTUNE),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.INSURANCE_2),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.INSURANCE_3A),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.BANK_3A),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.INSURANCE_3B),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.DONATION),
  ...makeArrayOfObjectsSchema('otherIncome', Object.values(OTHER_INCOME)),
  'otherIncome.$.comment': { type: String, optional: true },
  ...makeArrayOfObjectsSchema('otherFortune'),
  ...makeArrayOfObjectsSchema('expenses', Object.values(EXPENSES)),
  'expenses.$.comment': { type: String, optional: true },
  ...makeArrayOfObjectsSchema('realEstate', Object.values(RESIDENCE_TYPE)),
  'realEstate.$.loan': { ...moneyField, optional: false },
  'realEstate.$.name': { type: String, optional: true },
  'realEstate.$.income': { ...moneyField, optional: true, defaultValue: 0 },
  'realEstate.$.theoreticalExpenses': {
    ...moneyField,
    optional: true,
    defaultValue: 0,
  },
};

export const ownCompaniesSchema = {
  hasOwnCompany: {
    type: Boolean,
    optional: true,
    uniforms: {
      type: CUSTOM_AUTOFIELD_TYPES.BOOLEAN_RADIO,
    },
  },
  ownCompanies: {
    type: Array,
    defaultValue: [],
    optional: true,
    condition: ({ hasOwnCompany }) => !!hasOwnCompany,
  },
  'ownCompanies.$': Object,
  'ownCompanies.$.description': { type: String, optional: false },
  'ownCompanies.$.ownership': percentageField,
  'ownCompanies.$.netIncome2016': moneyField,
  'ownCompanies.$.netIncome2017': moneyField,
  'ownCompanies.$.netIncome2018': moneyField,
};
