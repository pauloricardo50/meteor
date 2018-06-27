import SimpleSchema from 'simpl-schema';
import {
  AUCTION_STATUS,
  OFFER_TYPE,
  CLOSING_STEPS_TYPE,
  CLOSING_STEPS_STATUS,
  INSURANCE_USE_PRESET,
  LOAN_STRATEGY_PRESET,
  AMORTIZATION_STRATEGY_PRESET,
  PAYMENT_SCHEDULES,
} from '../../constants';

const closingStepsSchema = {
  closingSteps: {
    type: Array,
    defaultValue: [],
  },
  'closingSteps.$': Object,
  'closingSteps.$.id': String,
  'closingSteps.$.type': {
    type: String,
    allowedValues: Object.values(CLOSING_STEPS_TYPE),
  },
  'closingSteps.$.title': String,
  'closingSteps.$.description': { type: String, optional: true },
  'closingSteps.$.status': {
    type: String,
    optional: true,
    allowedValues: Object.values(CLOSING_STEPS_STATUS),
  },
  'closingSteps.$.error': { type: String, optional: true },
};

const verificationSchema = {
  verification: {
    type: Object,
    defaultValue: {},
  },
  'verification.requested': {
    type: Boolean,
    optional: true,
  },
  'verification.requestedAt': {
    type: Date,
    optional: true,
  },
  'verification.validated': {
    type: Boolean,
    optional: true,
  },
  'verification.comments': {
    type: Array,
    defaultValue: [],
  },
  'verification.comments.$': String,
  'verification.verifiedAt': {
    type: Date,
    optional: true,
  },
};

const lenderSchema = {
  lender: {
    type: Object,
    defaultValue: {},
  },
  'lender.type': {
    type: String,
    optional: true,
    allowedValues: Object.values(OFFER_TYPE),
  },
  'lender.offerId': {
    type: String,
    optional: true,
  },
  'lender.chosenTime': {
    type: Date,
    optional: true,
  },
  'lender.contacted': {
    type: Boolean,
    defaultValue: false,
  },
  'lender.nextSteps': {
    type: Array,
    defaultValue: [],
  },
  'lender.nextSteps.$': String,
  'lender.contractRequested': {
    type: Boolean,
    defaultValue: false,
  },
  'lender.contractLoanSent': {
    type: Boolean,
    defaultValue: false,
  },
  'lender.contract': {
    type: String,
    defaultValue: '',
    optional: true,
  },
};

const auctionSchema = {
  auction: {
    type: Object,
    defaultValue: {},
  },
  'auction.status': {
    type: String,
    optional: true,
    defaultValue: AUCTION_STATUS.NONE,
    allowedValues: Object.values(AUCTION_STATUS),
  },
  'auction.startTime': {
    type: Date,
    optional: true,
  },
  'auction.endTime': {
    type: Date,
    optional: true,
  },
};

// All logic fields required by the app to trigger the right things at the right time
export const LogicSchema = new SimpleSchema({
  step: {
    type: Number,
    defaultValue: 1,
    min: 1,
    max: 5,
  },
  expertiseRequired: {
    type: Boolean,
    defaultValue: true,
  },
  expertiseDone: {
    type: Boolean,
    defaultValue: false,
  },
  expertiseValid: {
    type: Boolean,
    defaultValue: false,
  },

  hasValidatedStructure: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  insuranceUsePreset: {
    type: String,
    optional: true,
    allowedValues: Object.values(INSURANCE_USE_PRESET),
  },
  loanStrategyPreset: {
    type: String,
    optional: true,
    allowedValues: Object.values(LOAN_STRATEGY_PRESET),
  },
  amortizationStrategyPreset: {
    type: String,
    optional: true,
    allowedValues: Object.values(AMORTIZATION_STRATEGY_PRESET),
  },
  acceptedClosing: {
    type: Boolean,
    defaultValue: false,
  },
  recommendationCode: {
    type: String,
    defaultValue: '',
    optional: true,
  },
  firstPaymentDate: {
    type: Date,
    optional: true,
  },
  paymentSchedule: {
    type: String,
    optional: true,
    allowedValues: Object.values(PAYMENT_SCHEDULES),
  },
  ...verificationSchema,
  ...closingStepsSchema,
  ...lenderSchema,
  ...auctionSchema,
});
