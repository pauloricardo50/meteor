import { Method } from '../methods/methods';

export const taskInsert = new Method({
  name: 'taskInsert',
  params: {
    object: Object,
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

export const proAddLoanTask = new Method({
  name: 'proAddLoanTask',
  params: {
    loanId: String,
    note: String,
  },
});

export const taskRemove = new Method({
  name: 'taskRemove',
  params: {
    taskId: String,
  },
});
