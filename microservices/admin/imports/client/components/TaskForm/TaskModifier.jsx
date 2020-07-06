import React from 'react';
import { withProps } from 'recompose';

import { taskUpdate } from 'core/api/tasks/methodDefinitions';
import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import Box from 'core/components/Box';
import T from 'core/components/Translation';

import { taskFormSchema } from './taskFormHelpers';

export const taskFormLayout = [
  {
    Component: Box,
    className: 'mb-32',
    title: <h5>Général</h5>,
    fields: ['title', 'description'],
    layout: { className: 'grid-2', fields: ['assigneeLink._id', 'isPrivate'] },
  },
  {
    Component: Box,
    title: <h5>Échéance</h5>,
    layout: [
      'dueAtTimeHelpers',
      'dueAtDateHelpers',
      { className: 'grid-2', fields: ['dueAt', 'dueAtTime'] },
    ],
  },
];

const labels = {
  title: <T id="TasksTable.title" />,
  dueAt: <T id="TasksTable.dueAt" />,
  status: <T id="TasksTable.status" />,
  assignedEmployeeId: <T id="TasksTable.assignedTo" />,
};

const getTime = date => {
  if (!date) {
    return undefined;
  }
  const hours = date.getHours() || '00';
  const minutes = date.getMinutes() || '00';
  return `${hours}:${minutes}`;
};

const TaskModifier = ({ task, updateTask, open, setOpen }) => {
  const model = { ...task, dueAtTime: getTime(task.dueAt) };
  return (
    <AutoFormDialog
      schema={taskFormSchema}
      model={model}
      autoFieldProps={{ labels }}
      onSubmit={updateTask}
      open={open}
      setOpen={setOpen}
      title="Modifier tâche"
      layout={taskFormLayout}
    />
  );
};

export default withProps(({ task: { _id: taskId } }) => ({
  updateTask: values => taskUpdate.run({ taskId, object: values }),
}))(TaskModifier);
