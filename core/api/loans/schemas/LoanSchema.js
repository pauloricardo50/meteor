// @flow
import SimpleSchema from 'simpl-schema';
import uniforms from 'uniforms-material'; // Leave this imported here for autoforms to work

import DateField from 'imports/core/components/DateField/DateField';
import {
  createdAt,
  updatedAt,
  contactsSchema,
  additionalDocuments,
} from '../../helpers/sharedSchemas';
import { LOAN_STATUS, LOAN_VERIFICATION_STATUS } from '../loanConstants';
import GeneralSchema from './GeneralSchema';
import LogicSchema from './LogicSchema';
import StructureSchema from './StructureSchema';
import promotionSchema from './promotionSchema';
import { borrowerIdsSchema, propertyIdsSchema } from './otherSchemas';

const LoanSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true,
  },
  createdAt,
  updatedAt,
  disbursementDate: { type: Date, optional: true },
  signingDate: { type: Date, optional: true },
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
  verificationStatus: {
    type: String,
    optional: true,
    allowedValues: Object.values(LOAN_VERIFICATION_STATUS),
    defaultValue: LOAN_VERIFICATION_STATUS.NONE,
  },
  ...promotionSchema,
  ...borrowerIdsSchema,
  ...propertyIdsSchema,
  ...contactsSchema,
  ...additionalDocuments([]),
});

export default LoanSchema;
