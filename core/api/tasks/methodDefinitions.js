import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const taskInsert = new Method({
  name: 'taskInsert',
  params: {
    type: String,
  },
});

export const taskUpdate = new Method({
  name: 'taskUpdate',
  params: {
    taskId: String,
    object: Object,
  },
});

export const taskComplete = new Method({
  name: 'taskComplete',
  params: {
    taskId: String,
  },
});

export const taskCompleteByType = new Method({
  name: 'taskCompleteByType',
  params: {
    type: String,
    loanId: String,
    newStatus: Match.Optional(String),
  },
});

export const taskChangeStatus = new Method({
  name: 'taskChangeStatus',
  params: {
    taskId: String,
    newStatus: String,
  },
});

export const taskChangeAssignedTo = new Method({
  name: 'taskChangeAssignedTo',
  params: {
    taskId: String,
    newAssignee: String,
  },
});

export const taskGetRelatedTo = new Method({
  name: 'taskGetRelatedTo',
  params: {
    task: Object,
  },
});
