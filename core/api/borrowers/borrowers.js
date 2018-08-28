import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import {
  BORROWERS_COLLECTION,
  RESIDENCY_PERMIT,
  GENDER,
  CIVIL_STATUS,
  OTHER_INCOME,
  EXPENSES,
  REAL_ESTATE,
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

// Documentation is in the google drive dev/MongoDB Schemas
export const BorrowerSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    },
  },
  updatedAt: {
    type: Date,
    autoValue() {
      // Verify the update is from the user owning this doc, ignoring admin/partner updates
      const doc = Borrowers.findOne(this.docId, { fields: { userId: 1 } });

      if (this.isInsert) {
        return new Date();
      }
      if (this.isUpdate && doc && this.userId === doc.userId) {
        return new Date();
      }
    },
  },

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
  bonus: {
    type: Object,
    defaultValue: {},
  },
  'bonus.bonus2014': {
    // oldest
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  'bonus.bonus2015': {
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  'bonus.bonus2016': {
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  'bonus.bonus2017': {
    // most recent
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  otherIncome: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'otherIncome.$': Object,
  'otherIncome.$.value': {
    type: Number,
    min: 0,
    max: 100000000,
  },
  'otherIncome.$.description': {
    type: String,
    allowedValues: Object.values(OTHER_INCOME),
  },
  otherFortune: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'otherFortune.$': Object,
  'otherFortune.$.value': {
    type: Number,
    min: 0,
    max: 100000000,
  },
  'otherFortune.$.description': {
    type: String,
    optional: true,
  },
  expenses: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'expenses.$': Object,
  'expenses.$.value': {
    type: Number,
    min: 0,
    max: 100000000,
  },
  'expenses.$.description': {
    type: String,
    allowedValues: Object.values(EXPENSES),
  },
  bankFortune: {
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  realEstate: {
    type: Array,
    optional: true,
    defaultValue: [],
  },
  'realEstate.$': Object,
  'realEstate.$.value': {
    type: Number,
    min: 0,
    max: 100000000,
  },
  'realEstate.$.loan': {
    type: Number,
    min: 0,
    max: 100000000,
  },
  'realEstate.$.description': {
    type: String,
    allowedValues: Object.values(REAL_ESTATE),
  },
  corporateBankExists: {
    type: Boolean,
    defaultValue: false,
  },
  corporateBank: {
    type: String,
    optional: true,
  },
  insurance2: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  insurance3A: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  insurance3B: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  bank3A: {
    type: Number,
    optional: true,
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
});

Borrowers.attachSchema(BorrowerSchema);
export default Borrowers;
