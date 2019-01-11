import SimpleSchema from 'simpl-schema';
import { STEPS } from '../../constants';

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

// All logic fields required by the app to trigger the right things at the right time
const LogicSchema = new SimpleSchema({
  step: {
    type: String,
    defaultValue: STEPS.PREPARATION,
    allowedValues: Object.values(STEPS),
  },
  ...verificationSchema,
});

export default LogicSchema;
