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
