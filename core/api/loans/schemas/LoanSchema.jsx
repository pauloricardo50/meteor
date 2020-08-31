import React from 'react';
import SimpleSchema from 'simpl-schema';

import T from '../../../components/Translation';
import {
  additionalDocuments,
  adminNotesSchema,
  cacheField,
  contactsSchema,
  createdAt,
  documentsField,
  moneyField,
  updatedAt,
} from '../../helpers/sharedSchemas';
import { RESIDENCE_TYPE } from '../../properties/propertyConstants';
import { initialDocuments } from '../loanAdditionalDocuments';
import {
  ACQUISITION_STATUS,
  CANTONS,
  INSURANCE_POTENTIAL,
  LOAN_CATEGORIES,
  LOAN_STATUS,
  OWNER,
  PURCHASE_TYPE,
  STEPS,
  UNSUCCESSFUL_LOAN_REASONS,
  UNSUCCESSFUL_LOAN_REASON_CATEGORIES,
} from '../loanConstants';
import {
  borrowerIdsSchema,
  maxPropertyValueSchema,
  previousLoanTranchesSchema,
  propertyIdsSchema,
} from './otherSchemas';
import promotionSchema from './promotionSchema';
import StructureSchema from './StructureSchema';

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
  customName: { type: String, optional: true },
  previousLender: { type: String, optional: true },
  previousLoanAmortization: moneyField,
  ...contactsSchema,
  ...previousLoanTranchesSchema,
  ...additionalDocuments(initialDocuments),
  step: {
    type: String,
    defaultValue: STEPS.SOLVENCY,
    allowedValues: Object.values(STEPS),
    uniforms: { placeholder: '' },
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
  simpleBorrowersForm: { type: Boolean, defaultValue: true },
  ...adminNotesSchema,
  proNote: {
    type: new SimpleSchema(adminNotesSchema).getObjectSchema('adminNotes.$'),
    optional: true,
  },
  disbursementDate: { type: Date, optional: true },
  frontTagId: { type: String, optional: true },
  acquisitionStatus: {
    type: String,
    optional: true,
    allowedValues: Object.values(ACQUISITION_STATUS),
  },
  hasCompletedOnboarding: {
    type: Boolean,
    optional: true,
  },

  // Link storage fields
  ...promotionSchema,
  ...borrowerIdsSchema,
  ...propertyIdsSchema,
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
  financedPromotionLink: { type: Object, optional: true },
  'financedPromotionLink._id': { type: String, optional: true },
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
  insuranceRequestLinks: { type: Array, optional: true, defaultValue: [] },
  'insuranceRequestLinks.$': Object,
  'insuranceRequestLinks.$._id': String,
  insurancePotential: {
    type: String,
    optional: true,
    allowedValues: Object.values(INSURANCE_POTENTIAL),
  },

  // Cache fields
  lendersCache: { type: Array, optional: true },
  'lendersCache.$': cacheField,
  tasksCache: { type: Array, optional: true },
  'tasksCache.$': cacheField,
  userCache: cacheField,
  unsuccessfulReason: {
    type: String,
    optional: true,
    uniforms: {
      recommendedValues: Object.values(UNSUCCESSFUL_LOAN_REASONS),
      withCustomOther: true,
      grouping: {
        groupBy: reason =>
          Object.keys(UNSUCCESSFUL_LOAN_REASON_CATEGORIES).find(key =>
            UNSUCCESSFUL_LOAN_REASON_CATEGORIES[key].includes(reason?.id),
          ),
        format: category =>
          category ? (
            <T id={`Forms.unsuccessfulReason.category.${category}`} />
          ) : (
            <T id="general.other" />
          ),
      },
      displayEmpty: false,
      placeholder: '',
    },
  },
  closingChecklistLinks: { type: Array, optional: true },
  'closingChecklistLinks.$': Object,
  'closingChecklistLinks.$._id': String,
  showClosingChecklists: { type: Boolean, defaultValue: false },
  hasStartedOnboarding: { type: Boolean, defaultValue: false },
  adminAnalysis: {
    type: String,
    optional: true,
    uniforms: { multiline: true, rows: 5, label: 'Analyse', placeholder: ' ' },
  },
});

export default LoanSchema;
