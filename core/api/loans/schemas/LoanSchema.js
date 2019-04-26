// @flow
import SimpleSchema from 'simpl-schema';

import {
  createdAt,
  updatedAt,
  contactsSchema,
  additionalDocuments,
  documentsField,
} from '../../helpers/sharedSchemas';
import {
  LOAN_STATUS,
  LOAN_VERIFICATION_STATUS,
  PURCHASE_TYPE,
  OWNER,
  CANTONS,
  STEPS,
  APPLICATION_TYPES,
} from '../loanConstants';
import { RESIDENCE_TYPE } from '../../constants';
import StructureSchema from './StructureSchema';
import promotionSchema from './promotionSchema';
import {
  borrowerIdsSchema,
  propertyIdsSchema,
  previousLoanTranchesSchema,
  maxPropertyValueSchema,
} from './otherSchemas';
import { CUSTOM_AUTOFIELD_TYPES } from '../../../components/AutoForm2/constants';

const LoanSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true,
  },
  createdAt,
  updatedAt,
  closingDate: {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  signingDate: {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  status: {
    type: String,
    defaultValue: LOAN_STATUS.LEAD,
    allowedValues: Object.values(LOAN_STATUS),
  },
  general: { type: Object, optional: true, blackbox: true, defaultValue: {} }, // To be removed once migrations are done
  name: { type: String, unique: true, regEx: /^\d{2}-\d{4}$/ },
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
    uniforms: { displayEmpty: false },
  },
  purchaseType: {
    type: String,
    defaultValue: PURCHASE_TYPE.ACQUISITION,
    allowedValues: Object.values(PURCHASE_TYPE),
    uniforms: { displayEmpty: false },
  },
  residenceType: {
    type: String,
    allowedValues: Object.values(RESIDENCE_TYPE),
    optional: true,
    uniforms: { displayEmpty: false },
  },
  canton: {
    type: String,
    optional: true,
    allowedValues: Object.keys(CANTONS),
  },
  currentOwner: {
    type: String,
    defaultValue: OWNER.FIRST,
    allowedValues: Object.values(OWNER),
  },
  futureOwner: {
    type: String,
    defaultValue: OWNER.FIRST,
    allowedValues: Object.values(OWNER),
  },
  otherOwner: {
    type: String,
    optional: true,
  },
  enableOffers: { type: Boolean, optional: true, defaultValue: false },
  previousLender: { type: String, optional: true },
  customName: { type: String, optional: true },
  applicationType: {
    type: String,
    allowedValues: Object.values(APPLICATION_TYPES),
    defaultValue: APPLICATION_TYPES.SIMPLE,
    uniforms: { placeholder: null },
  },
  ...promotionSchema,
  ...borrowerIdsSchema,
  ...propertyIdsSchema,
  ...contactsSchema,
  ...previousLoanTranchesSchema,
  ...additionalDocuments([]),
  revenueLinks: { type: Array, defaultValue: [] },
  'revenueLinks.$': String,
  userCache: {
    type: Object,
    blackbox: true,
    optional: true,
  },
  step: {
    type: String,
    defaultValue: STEPS.SOLVENCY,
    allowedValues: Object.values(STEPS),
    uniforms: { placeholder: '' },
  },
  displayWelcomeScreen: {
    type: Boolean,
    defaultValue: true,
    optional: true,
  },
  ...maxPropertyValueSchema,
  shareSolvency: { type: Boolean, optional: true },
  documents: documentsField,
});

export default LoanSchema;
