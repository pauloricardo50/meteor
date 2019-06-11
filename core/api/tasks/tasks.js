import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import { createdAt, updatedAt } from '../helpers/sharedSchemas';
import { TASK_STATUS, TASKS_COLLECTION } from './taskConstants';

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

export const TasksSchema = new SimpleSchema({
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
  assigneeLink: {
    type: Object,
    optional: true,
  },
  'assigneeLink._id': {
    type: String,
    optional: true,
  },
  title: {
    type: String,
    optional: true,
  },
  loanLink: {
    type: Object,
    optional: true,
  },
  'loanLink._id': {
    type: String,
    optional: true,
  },
  userLink: {
    type: Object,
    optional: true,
  },
  'userLink._id': {
    type: String,
    optional: true,
  },
});

Tasks.attachSchema(TasksSchema);
export default Tasks;
