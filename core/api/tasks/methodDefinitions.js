import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const taskInsert = new Method({
  name: 'taskInsert',
  params: {
    type: Match.Optional(String),
    title: Match.Optional(String),
    description: Match.Optional(String),
    docId: Match.Optional(String),
    assignedTo: Match.Optional(String),
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

export const setAssigneeOfTask = new Method({
  name: 'setAssigneeOfTask',
  params: {
    taskId: String,
    newAssigneeId: String,
  },
});
