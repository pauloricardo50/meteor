import SimpleSchema from 'simpl-schema';

import {
  createdAt,
  updatedAt,
  contactsSchema,
  additionalDocuments,
  documentsField,
  cacheField,
  adminNotesSchema,
} from '../../helpers/sharedSchemas';
import {
  LOAN_STATUS,
  PURCHASE_TYPE,
  OWNER,
  CANTONS,
  STEPS,
  APPLICATION_TYPES,
  LOAN_CATEGORIES,
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
  general: { type: Object, optional: true, blackbox: true, defaultValue: {} }, // To be removed once migrations are done
  name: { type: String, unique: true, regEx: /^\d{2}-\d{4}$/ },
  userFormsEnabled: { type: Boolean, defaultValue: true, optional: true },
  structures: { type: Array, defaultValue: [] },
  'structures.$': StructureSchema,
  selectedStructure: { type: String, optional: true },
  structureCache: { type: Object, optional: true, blackbox: true },
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
  revenueLinks: {
    type: Array,
    optional: true,
    autoValue() {
      // Avoid a weird edge case where removing revenues would cause this
      // potential empty array to throw on MongoDB with: `E11000 duplicate key error collection: meteor.loans index: revenueLinks_1 dup key: { : undefined }`
      if (this.isSet && Array.isArray(this.value) && this.value.length === 0) {
        this.unset();
      }
    },
  },
  'revenueLinks.$': String,
  userCache: cacheField,
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
  anonymous: { type: Boolean, optional: true, defaultValue: false },
  referralId: { type: String, optional: true },
  category: {
    type: String,
    defaultValue: LOAN_CATEGORIES.STANDARD,
    allowedValues: Object.values(LOAN_CATEGORIES),
    uniforms: { placeholder: null },
  },
  lendersCache: { type: Array, optional: true },
  'lendersCache.$': cacheField,
  tasksCache: { type: Array, optional: true },
  'tasksCache.$': cacheField,
  financedPromotionLink: { type: Object, optional: true },
  'financedPromotionLink._id': { type: String, optional: true },
  simpleBorrowersForm: { type: Boolean, defaultValue: true },
  ...adminNotesSchema,
  proNote: {
    type: new SimpleSchema(adminNotesSchema).getObjectSchema('adminNotes.$'),
    optional: true,
  },
  disbursementDate: { type: Date, optional: true },
  selectedLenderOrganisationLink: { type: Object, optional: true },
  'selectedLenderOrganisationLink._id': { type: String, optional: true },
  assigneeLinks: { type: Array, optional: true },
  'assigneeLinks.$': Object,
  'assigneeLinks.$._id': String,
  'assigneeLinks.$.percent': {
    type: SimpleSchema.Integer,
    min: 10,
    max: 100,
    defaultValue: 100,
    allowedValues: [...Array(10)].map((_, i) => 10 * (i + 1)),
  },
  'assigneeLinks.$.isMain': {
    type: Boolean,
    autoValue() {
      if (!this.value) {
        return false;
      }
    },
  },
  frontTagId: { type: String, optional: true },
});

export default LoanSchema;
