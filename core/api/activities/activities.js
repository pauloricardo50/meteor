import SimpleSchema from 'simpl-schema';

import { EMAIL_IDS } from '../email/emailConstants';
import { createCollection } from '../helpers/collectionHelpers';
import { createdAt, updatedAt } from '../helpers/sharedSchemas';
import { autoValueSentenceCase } from '../helpers/sharedSchemaValues';
import {
  ACTIVITIES_COLLECTION,
  ACTIVITY_EVENT_METADATA,
  ACTIVITY_TYPES,
} from './activityConstants';

const Activities = createCollection(ACTIVITIES_COLLECTION);

const ActivitySchema = new SimpleSchema({
  createdAt,
  updatedAt,
  createdBy: {
    type: String,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return this.value || this.userId;
      }
      this.unset();
    },
  },
  title: {
    type: String,
    autoValue: autoValueSentenceCase,
  },
  description: {
    type: String,
    optional: true,
    autoValue: autoValueSentenceCase,
  },
  type: { type: String, allowedValues: Object.values(ACTIVITY_TYPES) },
  date: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return this.value || new Date();
      }
    },
  },
  loanLink: { type: Object, optional: true },
  'loanLink._id': { type: String, optional: true },
  shouldNotify: { type: Boolean, optional: true },
  userLink: { type: Object, optional: true },
  'userLink._id': { type: String, optional: true },
  insuranceRequestLink: { type: Object, optional: true },
  'insuranceRequestLink._id': { type: String, optional: true },
  insuranceLink: { type: Object, optional: true },
  'insuranceLink._id': { type: String, optional: true },
  isServerGenerated: { type: Boolean, defaultValue: false },
  isImportant: { type: Boolean, defaultValue: false },
});

const ActivityEventSchema = ActivitySchema.extend({
  metadata: { type: Object, optional: true, defaultValue: {} },
  'metadata.event': {
    type: String,
    allowedValues: Object.values(ACTIVITY_EVENT_METADATA),
    optional: true,
  },
  'metadata.details': {
    type: Object,
    blackbox: true,
    optional: true,
  },
});

const ActivityEmailSchema = ActivitySchema.extend({
  metadata: { type: Object, optional: true, defaultValue: {} },
  'metadata.emailId': {
    type: String,
    allowedValues: Object.values(EMAIL_IDS),
    optional: true,
  },
  'metadata.to': { type: SimpleSchema.oneOf(String, Array), optional: true },
  'metadata.to.$': { type: Object, blackbox: true, optional: true },
  'metadata.from': { type: String, optional: true },
  'metadata.response': { type: Object, blackbox: true, optional: true },
  'metadata.content': { type: Array, optional: true },
  'metadata.content.$': { type: Object, blackbox: true, optional: true },
});

const ActivityDripSchema = ActivitySchema.extend({
  metadata: { type: Object, optional: true, defaultValue: {} },
  'metadata.dripEmailId': {
    type: String,
    optional: true,
  },
  'metadata.dripEmailSubject': { type: String, optional: true },
});

const ActivityPhoneSchema = ActivitySchema;
const ActivityOtherSchema = ActivitySchema;
const ActivityMailSchema = ActivitySchema;
const ActivityMeetingSchema = ActivitySchema;
const ActivityPlanningSchema = ActivitySchema;

Activities.attachSchema(ActivityEventSchema, {
  selector: { type: ACTIVITY_TYPES.EVENT },
});
Activities.attachSchema(ActivityEmailSchema, {
  selector: { type: ACTIVITY_TYPES.EMAIL },
});
Activities.attachSchema(ActivityPhoneSchema, {
  selector: { type: ACTIVITY_TYPES.PHONE },
});
Activities.attachSchema(ActivityOtherSchema, {
  selector: { type: ACTIVITY_TYPES.OTHER },
});
Activities.attachSchema(ActivityMailSchema, {
  selector: { type: ACTIVITY_TYPES.MAIL },
});
Activities.attachSchema(ActivityMeetingSchema, {
  selector: { type: ACTIVITY_TYPES.MEETING },
});
Activities.attachSchema(ActivityPlanningSchema, {
  selector: { type: ACTIVITY_TYPES.FINANCIAL_PLANNING },
});
Activities.attachSchema(ActivityDripSchema, {
  selector: { type: ACTIVITY_TYPES.DRIP },
});

export default Activities;
