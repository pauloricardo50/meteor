import SimpleSchema from 'simpl-schema';
import {
  createdAt,
  updatedAt,
  additionalDocuments,
  address,
  mortgageNoteLinks,
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
import { initialDocuments } from '../borrowersAdditionalDocuments';

const LogicSchema = new SimpleSchema({
  adminValidated: {
    type: Boolean,
    defaultValue: false,
  },
});

const makeArrayOfObjectsSchema = (name, allowedValues) => ({
  [name]: { type: Array, defaultValue: [], optional: true },
  [`${name}.$`]: Object,
  [`${name}.$.value`]: { type: SimpleSchema.Integer, min: 0, max: 100000000 },
  [`${name}.$.description`]: { type: String, optional: true, allowedValues },
});

// Documentation is in the google drive dev/MongoDB Schemas
const BorrowerSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true,
  },
  createdAt,
  updatedAt,
  // Personal Information
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  gender: {
    type: String,
    optional: true,
    allowedValues: Object.values(GENDER),
  },
  age: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 1,
    max: 120,
  },
  ...address,
  sameAddress: {
    type: Boolean,
    optional: true,
  },
  isSwiss: {
    type: Boolean,
    optional: true,
  },
  residencyPermit: {
    type: String,
    optional: true,
    allowedValues: Object.values(RESIDENCY_PERMIT),
  },
  citizenship: {
    type: String,
    optional: true,
  },
  isUSPerson: {
    type: Boolean,
    optional: true,
  },
  civilStatus: {
    type: String,
    allowedValues: Object.values(CIVIL_STATUS),
    optional: true,
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
  },
  salary: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
    max: 100000000,
  },
  bonusExists: {
    type: Boolean,
    defaultValue: false,
  },
  bonus2015: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 100000000,
    optional: true,
  },
  bonus2016: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 100000000,
    optional: true,
  },
  bonus2017: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 100000000,
    optional: true,
  },
  bonus2018: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 100000000,
    optional: true,
  },
  [OWN_FUNDS_TYPES.BANK_FORTUNE]: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 100000000,
    optional: true,
  },
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.INSURANCE_2),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.INSURANCE_3A),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.BANK_3A),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.INSURANCE_3B),
  [OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE]: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 0,
    max: 100000000,
  },
  ...makeArrayOfObjectsSchema('otherIncome', Object.values(OTHER_INCOME)),
  ...makeArrayOfObjectsSchema('otherFortune'),
  ...makeArrayOfObjectsSchema('expenses', Object.values(EXPENSES)),
  ...makeArrayOfObjectsSchema('realEstate', Object.values(RESIDENCE_TYPE)),
  'realEstate.$.loan': {
    type: SimpleSchema.Integer,
    min: 0,
    max: 100000000,
  },
  // business logic and admin
  logic: {
    type: LogicSchema,
    defaultValue: {},
  },
  admin: {
    // TODO
    type: Object,
    optional: true,
  },
  adminValidation: {
    type: Object,
    defaultValue: {},
    blackbox: true,
  },
  ...additionalDocuments(initialDocuments),
  ...mortgageNoteLinks,
});

const protectedKeys = [
  '_id',
  'additionalDocuments',
  'admin',
  'adminValidation',
  'createdAt',
  'logic',
  'updatedAt',
  'userId',
];

export const BorrowerSchemaAdmin = BorrowerSchema.omit(...protectedKeys);
export default BorrowerSchema;
