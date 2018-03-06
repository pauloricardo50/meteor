export const TASK_INSERT = {
  name: 'TASK_INSERT',
  params: {
    // loanId: { type: String },
    type: { type: String },
  },
};

export const TASK_UPDATE = {
  name: 'TASK_UPDATE',
  params: {
    taskId: { type: String },
    task: { type: Object },
  },
};

export const TASK_COMPLETE = {
  name: 'TASK_COMPLETE',
  params: {
    taskId: { type: String },
  },
};

export const TASK_COMPLETE_BY_TYPE = {
  name: 'TASK_COMPLETE_BY_TYPE',
  params: {
    type: { type: String },
    loanId: { type: String },
    newStatus: { type: String, optional: true },
  },
};

export const TASK_CHANGE_STATUS = {
  name: 'TASK_CHANGE_STATUS',
  params: {
    taskId: { type: String },
    newStatus: { type: String },
  },
};

export const TASK_CHANGE_ASSIGNED_TO = {
  name: 'TASK_CHANGE_ASSIGNED_TO',
  params: {
    taskId: { type: String },
    newAssignee: { type: String },
  },
};

export const TASK_IS_RELATED_TO = {
  name: 'TASK_IS_RELATED_TO',
  params: {
    task: { type: Object },
    userId: { type: String },
  },
};

export const TASK_GET_RELATED_TO = {
  name: 'TASK_GET_RELATED_TO',
  params: {
    task: { type: Object },
  },
};
