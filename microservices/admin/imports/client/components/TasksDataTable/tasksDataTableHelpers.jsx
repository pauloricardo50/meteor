import React from 'react';
import moment from 'moment';

import { taskUpdate } from 'core/api/tasks/methodDefinitions';

import {
  taskFormLabels,
  taskFormLayout,
  taskFormSchema,
} from '../TaskForm/taskFormHelpers';

const getTime = date => {
  if (!date) {
    return undefined;
  }
  const hours = date.getHours() || '00';
  const minutes = date.getMinutes() || '00';
  return `${hours}:${minutes}`;
};

export const getTasksTableModalProps = task => {
  const model = { ...task, dueAtTime: getTime(task?.dueAt) };

  return {
    schema: taskFormSchema,
    model,
    autoFieldProps: { labels: taskFormLabels },
    onSubmit: values => taskUpdate.run({ taskId: task?._id, object: values }),
    title: 'Modifier tâche',
    layout: taskFormLayout,
  };
};

const now = moment();
export const formatDateTime = (date, toNow) => {
  const momentDate = moment(date);
  const text = date ? momentDate[toNow ? 'toNow' : 'fromNow']() : '-';

  if (momentDate.isBefore(now)) {
    return <span className="error-box">{text}</span>;
  }

  return text;
};
