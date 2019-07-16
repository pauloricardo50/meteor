import { Mongo } from 'meteor/mongo';

import SimpleSchema from 'simpl-schema';

import { createdAt, updatedAt } from '../helpers/sharedSchemas';
import {
  ACTIVITY_TYPES,
  ACTIVITY_SECONDARY_TYPES,
  ACTIVITIES_COLLECTION,
} from './activityConstants';

const Activities = new Mongo.Collection(ACTIVITIES_COLLECTION);

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
  title: String,
  description: { type: String, optional: true },
  type: { type: String, allowedValues: Object.values(ACTIVITY_TYPES) },
  secondaryType: {
    type: String,
    optional: true,
    allowedValues: Object.values(ACTIVITY_SECONDARY_TYPES),
  },
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
});

Activities.attachSchema(ActivitySchema);

export default Activities;
