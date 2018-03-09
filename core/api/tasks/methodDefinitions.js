import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const taskInsert = new Method({
  name: 'taskInsert',
  params: {
    loanId: String,
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

export const taskChangeUser = new Method({
  name: 'taskChangeUser',
  params: {
    taskId: String,
    newUser: String,
  },
});
