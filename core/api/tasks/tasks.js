import SimpleSchema from 'simpl-schema';

import { createCollection } from '../helpers/collectionHelpers';
import { createdAt, updatedAt } from '../helpers/sharedSchemas';
import { autoValueSentenceCase } from '../helpers/sharedSchemaValues';
import {
  TASKS_COLLECTION,
  TASK_PRIORITIES,
  TASK_STATUS,
  TASK_TYPES,
} from './taskConstants';

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
  isPrivate: {
    type: Boolean,
    defaultValue: false,
  },
  priority: {
    type: String,
    defaultValue: TASK_PRIORITIES.DEFAULT,
    allowedValues: Object.values(TASK_PRIORITIES),
  },
  type: {
    type: String,
    allowedValues: Object.values(TASK_TYPES),
    optional: true,
  },
  metadata: {
    type: Object,
    blackbox: true,
    optional: true,
  },

  // Links
  assigneeLink: {
    type: Object,
    optional: true,
  },
  'assigneeLink._id': {
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
  insuranceRequestLink: { type: Object, optional: true },
  'insuranceRequestLink._id': { type: String, optional: true },
  insuranceLink: { type: Object, optional: true },
  'insuranceLink._id': { type: String, optional: true },
});

const Tasks = createCollection(TASKS_COLLECTION, TasksSchema);

export default Tasks;
