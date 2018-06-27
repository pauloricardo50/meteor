import SimpleSchema from 'simpl-schema';

import { LOAN_STATUS } from '../loanConstants';
import GeneralSchema from './GeneralSchema';
import LogicSchema from './LogicSchema';
import { contactsSchema, borrowerIdsSchema } from './otherSchemas';

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
  logic: { type: LogicSchema, defaultValue: {} },
  propertyId: { type: String },
  documents: { type: Object, defaultValue: {}, blackbox: true },
  adminValidation: { type: Object, defaultValue: {}, blackbox: true },
  adminNote: { type: String, defaultValue: '', optional: true },
  userFormsEnabled: { type: Boolean, defaultValue: true, optional: true },
  ...borrowerIdsSchema,
  ...contactsSchema,
});

export default LoanSchema;
