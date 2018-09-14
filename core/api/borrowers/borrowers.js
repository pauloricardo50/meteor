import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt } from '../helpers/mongoHelpers';
import {
  BORROWERS_COLLECTION,
  RESIDENCY_PERMIT,
  GENDER,
  CIVIL_STATUS,
  OTHER_INCOME,
  EXPENSES,
  REAL_ESTATE,
  OWN_FUNDS_TYPES,
} from './borrowerConstants';

const Borrowers = new Mongo.Collection(BORROWERS_COLLECTION);

// Prevent all client side modifications of mongoDB
Borrowers.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Borrowers.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

const LogicSchema = new SimpleSchema({
  adminValidated: {
    type: Boolean,
    defaultValue: false,
  },
});

const makeArrayOfObjectsSchema = (name, allowedValues) => ({
  [name]: { type: Array, defaultValue: [], optional: true },
  [`${name}.$`]: Object,
  [`${name}.$.value`]: { type: Number, min: 0, max: 100000000 },
  [`${name}.$.description`]: { type: String, optional: true, allowedValues },
});

// Documentation is in the google drive dev/MongoDB Schemas
export const BorrowerSchema = new SimpleSchema({
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
  address1: {
    type: String,
    optional: true,
  },
  address2: {
    type: String,
    optional: true,
  },
  zipCode: {
    type: Number,
    optional: true,
    min: 1000,
    max: 9999,
  },
  city: {
    type: String,
    optional: true,
  },
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
  birthDate: {
    type: String,
    optional: true,
    regEx: '/^d{4}[/-](0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])$/', // YYYY-MM-DD
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
    type: Number,
    optional: true,
    min: 0,
    max: 20,
  },
  company: {
    type: String,
    optional: true,
  },
  salary: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  bonusExists: {
    type: Boolean,
    defaultValue: false,
  },
  bonus2015: {
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  bonus2016: {
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  bonus2017: {
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  bonus2018: {
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  [OWN_FUNDS_TYPES.BANK_FORTUNE]: {
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.INSURANCE_2),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.INSURANCE_3A),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.BANK_3A),
  ...makeArrayOfObjectsSchema(OWN_FUNDS_TYPES.INSURANCE_3B),
  [OWN_FUNDS_TYPES.THIRD_PARTY_FORTUNE]: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  ...makeArrayOfObjectsSchema('otherIncome', Object.values(OTHER_INCOME)),
  ...makeArrayOfObjectsSchema('otherFortune'),
  ...makeArrayOfObjectsSchema('expenses', Object.values(EXPENSES)),
  ...makeArrayOfObjectsSchema('realEstate', Object.values(REAL_ESTATE)),
  'realEstate.$.loan': {
    type: Number,
    min: 0,
    max: 100000000,
  },
  corporateBankExists: {
    type: Boolean,
    defaultValue: false,
  },
  corporateBank: {
    type: String,
    optional: true,
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
});

const protectedKeys = [
  '_id',
  'updatedAt',
  'createdAt',
  'admin',
  'adminValidation',
  'logic',
  'userId',
];

export const BorrowerSchemaAdmin = BorrowerSchema.omit(...protectedKeys);

Borrowers.attachSchema(BorrowerSchema);
export default Borrowers;
