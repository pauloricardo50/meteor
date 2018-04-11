import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { GeneralSchema, LogicSchema } from './additionalSchemas';
import { LOANS_COLLECTION, LOAN_STATUS } from './loanConstants';

const Loans = new Mongo.Collection(LOANS_COLLECTION);

// Prevent all client side modifications of mongoDB
Loans.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});
Loans.allow({
  insert: () => true,
  update: () => false,
  remove: () => false,
});

// Documentation is in the google drive dev/MongoDB Schemas
const LoanSchema = new SimpleSchema({
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
      const doc = Loans.findOne({ _id: this.docId }, { fields: { userId: 1 } });

      if (this.isInsert) {
        return new Date();
      } else if (this.isUpdate && doc && this.userId === doc.userId) {
        return new Date();
      }
    },
  },
  status: {
    type: String,
    defaultValue: LOAN_STATUS.ACTIVE,
    allowedValues: Object.values(LOAN_STATUS),
  },
  name: { type: String, optional: true, defaultValue: '' },
  general: { type: GeneralSchema, defaultValue: {} },
  borrowerIds: { type: Array, defaultValue: [] },
  'borrowerIds.$': String,
  propertyId: { type: String },
  documents: { type: Object, defaultValue: {}, blackbox: true },
  logic: { type: LogicSchema, defaultValue: {} },
  adminValidation: { type: Object, defaultValue: {}, blackbox: true },
  adminNote: { type: String, defaultValue: '', optional: true },
  contacts: { type: Array, defaultValue: [] },
  'contacts.$': Object,
  'contacts.$.name': String,
  'contacts.$.title': String,
  'contacts.$.email': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'contacts.$.phone': String,
});

// Finally, attach schema to the Mongo collection and export
Loans.attachSchema(LoanSchema);
export default Loans;
