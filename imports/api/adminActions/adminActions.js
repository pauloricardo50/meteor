import 'babel-polyfill';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const AdminActions = new Mongo.Collection('adminActions');

const AdminActionSchema = new SimpleSchema({
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      }
    },
  },
  status: {
    type: String,
    defaultValue: 'active',
  },
  completedAt: {
    type: Date,
    optional: true,
  },
  actionId: String,
  requestId: String,
  staffId: {
    type: String,
    optional: true,
  },
  extra: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  notes: {
    type: String,
    optional: true,
  },
});

AdminActions.attachSchema(AdminActionSchema);
export default AdminActions;
