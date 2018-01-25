import SimpleSchema from 'simpl-schema';
import {
  PURCHASE_TYPE,
  INTEREST_RATES,
  OWNER,
  CANTONS,
  AUCTION_STATUS,
  OFFER_TYPE,
  CLOSING_STEPS_TYPE,
  CLOSING_STEPS_STATUS,
  AUCTION_MOST_IMPORTANT,
  INSURANCE_USE_PRESET,
  LOAN_STRATEGY_PRESET,
  AMORTIZATION_STRATEGY_PRESET,
  PAYMENT_SCHEDULES,
} from './loanrequestConstants';
import { GENDER, USAGE_TYPE } from '../constants';

export const GeneralSchema = new SimpleSchema({
  purchaseType: {
    type: String,
    defaultValue: PURCHASE_TYPE.ACQUISITION,
    allowedValues: Object.values(PURCHASE_TYPE),
  },
  usageType: {
    type: String,
    defaultValue: USAGE_TYPE.PRIMARY,
    allowedValues: Object.values(USAGE_TYPE),
  },
  fortuneUsed: {
    type: Number,
    min: 0,
    max: 100000000,
    defaultValue: 0,
  },
  insuranceFortuneUsed: {
    type: Number,
    min: 0,
    max: 100000000,
    optional: true,
  },
  propertyWork: {
    type: Number,
    min: 0,
    max: 100000000,
    defaultValue: 0,
  },
  oldestAge: {
    type: SimpleSchema.Integer,
    optional: true,
    min: 18,
    max: 120,
  },
  oldestGender: {
    type: String,
    optional: true,
    allowedValues: Object.values(GENDER),
  },
  partnersToAvoidExists: {
    type: Boolean,
    defaultValue: false,
  },
  partnersToAvoid: {
    type: Array,
    defaultValue: [],
  },
  'partnersToAvoid.$': String,
  selectedPartner: {
    type: String,
    optional: true,
  },
  canton: {
    type: String,
    optional: true,
    allowedValues: Object.keys(CANTONS),
  },
  loanTranches: {
    type: Array,
    // minCount: 1,
    defaultValue: [
      {
        type: INTEREST_RATES.LIBOR,
        value: 100000,
      },
    ],
  },
  'loanTranches.$': Object,
  'loanTranches.$.type': {
    type: String,
    optional: true,
    allowedValues: Object.values(INTEREST_RATES),
  },
  'loanTranches.$.value': {
    type: Number,
    optional: true,
    min: 0,
    max: 100000000,
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
  wantedClosingDate: {
    type: Date,
    optional: true,
  },
  auctionMostImportant: {
    type: String,
    optional: true,
    allowedValues: Object.values(AUCTION_MOST_IMPORTANT),
  },
});

// All logic fields required by the app to trigger the right things at the right time
export const LogicSchema = new SimpleSchema({
  step: {
    type: Number,
    defaultValue: 1,
    min: 1,
    max: 5,
  },
  verification: {
    type: Object,
    defaultValue: {},
  },
  'verification.requested': {
    type: Boolean,
    optional: true,
  },
  'verification.requestedTime': {
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
  hasValidatedStructure: {
    type: Boolean,
    defaultValue: false,
    optional: true,
  },
  insuranceUsePreset: {
    type: String,
    // defaultValue: '',
    optional: true,
    allowedValues: Object.values(INSURANCE_USE_PRESET),
  },
  loanStrategyPreset: {
    type: String,
    // defaultValue: '',
    optional: true,
    allowedValues: Object.values(LOAN_STRATEGY_PRESET),
  },
  amortizationStrategyPreset: {
    type: String,
    // defaultValue: '',
    optional: true,
    allowedValues: Object.values(AMORTIZATION_STRATEGY_PRESET),
  },
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
  'lender.contractRequestSent': {
    type: Boolean,
    defaultValue: false,
  },
  'lender.contract': {
    type: String,
    defaultValue: '',
    optional: true,
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
});
