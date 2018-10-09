// @flow
import SimpleSchema from 'simpl-schema';
import uniforms from 'uniforms-material';

import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { LOAN_STATUS } from '../loanConstants';
import GeneralSchema from './GeneralSchema';
import LogicSchema from './LogicSchema';
import StructureSchema from './StructureSchema';
import promotionSchema from './promotionSchema';
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
    defaultValue: LOAN_STATUS.LEAD,
    allowedValues: Object.values(LOAN_STATUS),
  },
  name: { type: String, unique: true },
  general: { type: GeneralSchema, defaultValue: {} },
  logic: { type: LogicSchema, defaultValue: {} },
  adminValidation: { type: Object, defaultValue: {}, blackbox: true },
  userFormsEnabled: { type: Boolean, defaultValue: true, optional: true },
  structures: { type: Array, defaultValue: [] },
  'structures.$': StructureSchema,
  selectedStructure: { type: String, optional: true },
  ...promotionSchema,
  ...borrowerIdsSchema,
  ...propertyIdsSchema,
  ...contactsSchema,
});

export default LoanSchema;
