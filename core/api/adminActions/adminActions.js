import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { ADMIN_ACTION_TYPE, ADMIN_ACTION_STATUS } from './adminActionConstants';

const AdminActions = new Mongo.Collection('adminActions');

// Action types
// 'verify'
// 'auction'
// 'lenderChosen'

// Prevent all client side modifications of mongoDB
AdminActions.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

AdminActions.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

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
    defaultValue: ADMIN_ACTION_STATUS.ACTIVE,
    allowedValues: Object.values(ADMIN_ACTION_STATUS),
  },
  completedAt: {
    type: Date,
    optional: true,
  },
  type: {
    type: String,
    allowedValues: Object.values(ADMIN_ACTION_TYPE),
  },
  loanId: String,
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
