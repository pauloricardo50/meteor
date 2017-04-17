import 'babel-polyfill';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { BorrowerFilesSchema } from '../FileSchemas';

const Borrowers = new Mongo.Collection('borrowers');

Borrowers.allow({
  insert(userId, doc) {
    // This is true if someone is logged in
    return !!userId;
  },
  update(userId, doc) {
    // This is true if someone is logged in and the user is the same as the one who created it
    console.log(doc);
    return !!userId && userId === doc.userId;
  },
});

const LogicSchema = new SimpleSchema({
  financeEthics: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  hasValidatedFinances: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  adminValidated: {
    type: Boolean,
    defaultValue: false,
  },
});

// Documentation is in the google drive dev/MongoDB Schemas
export const BorrowerSchema = new SimpleSchema({
  userId: {
    type: String,
    index: true,
    autoValue() {
      if (this.isInsert) {
        return this.userId;
      }
    },
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
      const doc = Borrowers.findOne(
        { _id: this.docId },
        { fields: { userId: 1 } },
      );
      if (this.isUpdate && this.userId === doc.userId) {
        return new Date();
      } else if (this.isInsert) {
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
  },
  age: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 18,
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
    type: String,
    optional: true,
  },
  citizenships: {
    type: String,
    optional: true,
  },
  residencyPermit: {
    type: String,
    optional: true,
  },
  birthDate: {
    type: String,
    optional: true,
    regEx: '/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/', // YYYY-MM-DD
  },
  birthPlace: {
    type: String,
    optional: true,
  },
  civilStatus: {
    // 'married', 'pacsed', 'single', 'divorced'
    type: String,
    defaultValue: 'single',
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
  bonus: Object,
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
  },
  'otherIncome.$': Object,
  'otherIncome.$.value': {
    type: Number,
    min: 0,
    max: 100000000,
  },
  'otherIncome.$.description': String,
  expenses: {
    type: Array,
    optional: true,
  },
  'expenses.$': Object,
  'expenses.$.value': {
    type: Number,
    min: 0,
    max: 100000000,
  },
  'expenses.$.description': String,
  bankFortune: {
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  realEstate: {
    type: Array,
    optional: true,
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
  'realEstate.$.description': String,
  personalBank: {
    type: String,
    optional: true,
  },
  corporateBankExists: {
    type: Boolean,
    defaultValue: false,
  },
  corporateBank: {
    type: String,
    optional: true,
  },
  insuranceSecondPillar: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  insuranceThirdPillar: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  files: {
    type: BorrowerFilesSchema,
    defaultValue: {},
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
});

Borrowers.attachSchema(BorrowerSchema);
export default Borrowers;
