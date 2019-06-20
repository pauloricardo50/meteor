import { Mongo } from 'meteor/mongo';

import SimpleSchema from 'simpl-schema';

import { createdAt, updatedAt } from '../helpers/sharedSchemas';

const Activities = new Mongo.Collection('activities');

const ActivitySchema = new SimpleSchema({
  createdAt,
  updatedAt,
  createdBy: {
    type: String,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return this.userId;
      }
      this.unset();
    },
  },
  title: { type: String, optional: true },
  description: { type: String, optional: true },
  date: { type: Date },
  loanLink: { type: Object, optional: true },
  'loanLink._id': { type: String, optional: true },
});

Activities.attachSchema(ActivitySchema);

export default Activities;
