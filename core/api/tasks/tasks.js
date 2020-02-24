import SimpleSchema from 'simpl-schema';

import { createdAt, updatedAt } from '../helpers/sharedSchemas';
import {
  TASK_STATUS,
  TASKS_COLLECTION,
  TASK_PRIORITIES,
} from './taskConstants';

import { autoValueSentenceCase } from '../helpers/sharedSchemaValues';
import { createCollection } from '../helpers/collectionHelpers';

const Tasks = createCollection(TASKS_COLLECTION);

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
    autoValue() {
      if (this.isInsert) {
        return this.userId;
      }
      this.unset();
    },
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
    autoValue: autoValueSentenceCase,
  },
  description: {
    type: String,
    optional: true,
    autoValue: autoValueSentenceCase,
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
  promotionLink: {
    type: Object,
    optional: true,
  },
  'promotionLink._id': {
    type: String,
    optional: true,
  },
  organisationLink: {
    type: Object,
    optional: true,
  },
  'organisationLink._id': {
    type: String,
    optional: true,
  },
  lenderLink: {
    type: Object,
    optional: true,
  },
  'lenderLink._id': {
    type: String,
    optional: true,
  },
  contactLink: {
    type: Object,
    optional: true,
  },
  'contactLink._id': {
    type: String,
    optional: true,
  },
  isPrivate: {
    type: Boolean,
    defaultValue: false,
  },
  priority: {
    type: String,
    defaultValue: TASK_PRIORITIES.DEFAULT,
    allowedValues: Object.values(TASK_PRIORITIES),
  },
});

Tasks.attachSchema(TasksSchema);
export default Tasks;
