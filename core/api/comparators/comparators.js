import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Comparators = new Mongo.Collection('comparators');

// Prevent all client side modifications of mongoDB
Comparators.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
Comparators.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

export const ComparatorSchema = new SimpleSchema({
  userId: { type: String, index: true },
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
      if (this.isInsert || this.isUpdate) {
        return new Date();
      }
    },
  },
  useBorrowers: { type: Boolean, defaultValue: false },
  income: { type: Number, defaultValue: 100000, optional: true },
  fortune: { type: Number, defaultValue: 100000, optional: true },
  interestRate: { type: Number, defaultValue: 0.0125, optional: true },
  borrowRatio: { type: Number, defaultValue: 0.8, optional: true },
  usageType: { type: String, defaultValue: 'primary' },
  customFields: { type: Array, defaultValue: [] },
  'customFields.$': Object,
  'customFields.$.id': String,
  'customFields.$.name': String,
  'customFields.$.type': String,
  customFieldCount: { type: Number, defaultValue: 0 },
  hiddenFields: {
    type: Array,
    defaultValue: ['realBorrowRatio', 'incomeRatio', 'theoreticalMonthly'],
  },
  'hiddenFields.$': String,
  borrowers: { type: Array, defaultValue: [] },
  'borrowers.$': String,
});

// Attach schema
Comparators.attachSchema(ComparatorSchema);
export default Comparators;
