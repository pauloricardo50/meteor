import SimpleSchema from 'simpl-schema';

import {
  percentageField,
  moneyField,
  address,
} from '../../helpers/sharedSchemas';
import {
  RESIDENCY_PERMIT,
  GENDER,
  CIVIL_STATUS,
  OTHER_INCOME,
  EXPENSES,
  OWN_FUNDS_TYPES,
} from '../borrowerConstants';
import { RESIDENCE_TYPE } from '../../constants';
import { CUSTOM_AUTOFIELD_TYPES } from '../../../components/AutoForm2/constants';

const makeArrayOfObjectsSchema = (name, allowedValues) => ({
  [name]: { type: Array, defaultValue: [], optional: true },
  [`${name}.$`]: Object,
  [`${name}.$.value`]: { ...moneyField, optional: false },
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
  firstName: { type: String, optional: true },
  lastName: { type: String, optional: true },
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
  ...address,
  sameAddress: { type: Boolean, optional: true },
  isSwiss: { type: Boolean, optional: true },
  residencyPermit: {
    type: String,
    optional: true,
    allowedValues: Object.values(RESIDENCY_PERMIT),
    uniforms: { displayEmpty: false },
  },
  citizenship: { type: String, optional: true },
  isUSPerson: { type: Boolean, optional: true },
  civilStatus: {
    type: String,
    allowedValues: Object.values(CIVIL_STATUS),
    optional: true,
    uniforms: { displayEmpty: false },
  },
  childrenCount: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
    max: 20,
  },
  company: { type: String, optional: true },
};

export const financeInfoSchema = {
  salary: moneyField,
  netSalary: moneyField,
  bonusExists: { type: Boolean, optional: true },
  bonus2015: moneyField,
  bonus2016: moneyField,
  bonus2017: moneyField,
  bonus2018: moneyField,
  bonus2019: moneyField,
  [OWN_FUNDS_TYPES.BANK_FORTUNE]: moneyField,
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.INSURANCE_2),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.INSURANCE_3A),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.BANK_3A),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.INSURANCE_3B),
  [OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE]: moneyField,
  ...makeArrayOfObjectsSchema('otherIncome', Object.values(OTHER_INCOME)),
  'otherIncome.$.comment': { type: String, optional: true },
  ...makeArrayOfObjectsSchema('otherFortune'),
  ...makeArrayOfObjectsSchema('expenses', Object.values(EXPENSES)),
  'expenses.$.comment': { type: String, optional: true },
  ...makeArrayOfObjectsSchema('realEstate', Object.values(RESIDENCE_TYPE)),
  'realEstate.$.loan': { ...moneyField, optional: false },
  'realEstate.$.name': { type: String, optional: true },
  'realEstate.$.income': { ...moneyField, optional: true, defaultValue: 0 },
  'realEstate.$.theoreticalExpenses': { ...moneyField, optional: true, defaultValue: 0 },
};

export const ownCompaniesSchema = {
  hasOwnCompany: { type: Boolean, optional: true },
  ownCompanies: { type: Array, defaultValue: [], optional: true },
  'ownCompanies.$': Object,
  'ownCompanies.$.description': { type: String, optional: false },
  'ownCompanies.$.ownership': percentageField,
  'ownCompanies.$.netIncome2016': moneyField,
  'ownCompanies.$.netIncome2017': moneyField,
  'ownCompanies.$.netIncome2018': moneyField,
};
