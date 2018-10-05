import SimpleSchema from 'simpl-schema';
import {
  AUCTION_STATUS,
  CLOSING_STEPS_TYPE,
  CLOSING_STEPS_STATUS,
  STEPS,
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
const LogicSchema = new SimpleSchema({
  step: {
    type: String,
    defaultValue: STEPS.PREPARATION,
    allowedValues: Object.values(STEPS),
  },
  ...verificationSchema,
  ...closingStepsSchema,
  ...auctionSchema,
});

export default LogicSchema;
