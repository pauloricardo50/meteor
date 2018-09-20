import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { createdAt, updatedAt } from '../helpers/sharedSchemas';
import { TASK_STATUS, TASK_TYPE, TASKS_COLLECTION } from './taskConstants';

const Tasks = new Mongo.Collection(TASKS_COLLECTION);

// Prevent all client side modifications of mongoDB
Tasks.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Tasks.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

const TasksSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  status: {
    type: String,
    defaultValue: TASK_STATUS.ACTIVE,
    allowedValues: Object.values(TASK_STATUS),
  },
  completedAt: {
    type: Date,
    optional: true,
  },
  dueAt: {
    type: Date,
    optional: true,
  },
  createdBy: {
    type: String,
    optional: true,
  },
  assignedEmployeeId: {
    type: String,
    optional: true,
  },
  type: {
    type: String,
    allowedValues: Object.values(TASK_TYPE),
    optional: true,
  },
  title: {
    type: String,
    optional: true,
  },
  description: {
    type: String,
    optional: true,
  },
  loanId: {
    type: String,
    optional: true,
  },
  propertyId: {
    type: String,
    optional: true,
  },
  borrowerId: {
    type: String,
    optional: true,
  },
  fileKey: {
    type: String,
    optional: true,
  },
  userId: {
    type: String,
    optional: true,
  },
});

Tasks.attachSchema(TasksSchema);
export default Tasks;
