// @flow
import SimpleSchema from 'simpl-schema';
import uniforms from 'uniforms-material';

import { LOAN_STATUS } from '../loanConstants';
import GeneralSchema from './GeneralSchema';
import LogicSchema from './LogicSchema';
import StructureSchema from './StructureSchema';
import {
  contactsSchema,
  borrowerIdsSchema,
  propertyIdsSchema,
} from './otherSchemas';

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
      if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset();
    },
    optional: true,
  },
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
  },
  status: {
    type: String,
    defaultValue: LOAN_STATUS.ACTIVE,
    allowedValues: Object.values(LOAN_STATUS),
  },
  name: { type: String, unique: true },
  general: { type: GeneralSchema, defaultValue: {} },
  logic: { type: LogicSchema, defaultValue: {} },
  adminValidation: { type: Object, defaultValue: {}, blackbox: true },
  adminNote: { type: String, defaultValue: '', optional: true },
  userFormsEnabled: { type: Boolean, defaultValue: true, optional: true },
  structures: { type: Array, defaultValue: [] },
  'structures.$': StructureSchema,
  selectedStructure: { type: String, optional: true },
  ...borrowerIdsSchema,
  ...propertyIdsSchema,
  ...contactsSchema,
});

export default LoanSchema;
