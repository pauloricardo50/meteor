import 'babel-polyfill';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { BorrowerFilesSchema } from '../FileSchemas';
import uniforms from 'uniforms';

const Borrowers = new Mongo.Collection('borrowers');

Borrowers.allow({
  insert(userId, doc) {
    // This is true if someone is logged in
    return !!userId;
  },
  update(userId, doc) {
    // This is true if someone is logged in and the user is the same as the one who created it
    return !!userId && userId === doc.userId;
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
    uniforms: () => null,
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    },
    uniforms: () => null,
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
    uniforms: () => null,
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
    type: Number,
    optional: true,
    min: 18,
    max: 99,
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
  grossIncome: {
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
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  // otherIncome: {
  //   type: Array,
  //   optional: true,
  // },
  // 'otherIncome.$.value': {
  //   type: Number,
  //   min: 0,
  //   max: 100000000,
  // },
  // 'otherIncome.$.description': String,
  personalBank: {
    type: String,
    optional: true,
  },
  corporateBankExists: {
    type: Boolean,
    defaultValue: false,
    uniforms: () => null,
  },
  corporateBank: {
    type: String,
    optional: true,
  },
  currentRentExists: {
    type: Boolean,
    defaultValue: false,
    uniforms: () => null,
  },
  currentRent: {
    // Monthly
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  realEstateFortune: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  cashAndSecurities: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  existingDebt: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  // otherFortune: {
  //   type: Array,
  //   optional: true,
  // },
  // 'otherFortune.$.amount': {
  //   type: Number,
  //   min: 0,
  //   max: 100000000,
  // },
  // 'otherFortune.$.description': String,
  insuranceLpp: {
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
  insurancePureRisk: {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
  },
  files: {
    type: BorrowerFilesSchema,
    defaultValue: {},
    uniforms: () => null,
  },

  // business logic and admin
  logic: {
    type: Object,
    defaultValue: {},
    optional: true,
    uniforms: () => null,
  },
  admin: {
    // TODO
    type: Object,
    optional: true,
    uniforms: () => null,
  },
});

Borrowers.attachSchema(BorrowerSchema);
export default Borrowers;
