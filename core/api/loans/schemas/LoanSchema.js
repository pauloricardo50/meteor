// @flow
import SimpleSchema from 'simpl-schema';

import { createdAt, updatedAt } from '../../helpers/mongoHelpers';
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
  createdAt,
  updatedAt,
  status: {
    type: String,
    defaultValue: LOAN_STATUS.ACTIVE,
    allowedValues: Object.values(LOAN_STATUS),
  },
  name: { type: String, unique: true, denyUpdate: true },
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
