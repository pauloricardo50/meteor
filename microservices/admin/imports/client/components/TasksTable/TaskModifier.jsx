// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import { taskUpdate } from 'core/api/tasks/methodDefinitions';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { TASK_STATUS } from 'core/api/constants';
import { adminUsers as query } from 'core/api/users/queries';
import T from 'core/components/Translation/Translation';

type TaskModifierProps = {
  task: Object,
  updateTask: Function,
  open: boolean,
  setOpen: Function,
  submitting: boolean,
};

export const schema = new SimpleSchema({
  title: { type: String, uniforms: { placeholder: 'Faire la vaisselle' } },
  dueAt: {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  status: {
    type: String,
    allowedValues: Object.values(TASK_STATUS),
    defaultValue: TASK_STATUS.ACTIVE,
    uniforms: { displayEmpty: false, placeholder: '' },
  },
  assignedEmployeeId: {
    type: String,
    customAllowedValues: {
      query,
      params: () => ({ $body: { name: 1 }, admins: true }),
    },
    optional: true,
    defaultValue: null,
    uniforms: { transform: ({ name }) => name, labelProps: { shrink: true } },
  },
});

const labels = {
  title: <T id="TasksTable.title" />,
  dueAt: <T id="TasksTable.dueAt" />,
  status: <T id="TasksTable.status" />,
  assignedEmployeeId: <T id="TasksTable.assignedTo" />,
};

const TaskModifier = ({
  task,
  updateTask,
  open,
  setOpen,
  submitting,
}: TaskModifierProps) => {
  const model = task;
  return (
    <AutoFormDialog
      schema={schema}
      model={model}
      autoFieldProps={{ labels }}
      onSubmit={updateTask}
      open={open}
      setOpen={setOpen}
      submitting={submitting}
    />
  );
};

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ setOpen, setSubmitting, task: { _id: taskId } }) => ({
    updateTask: (values) => {
      setSubmitting(true);
      return taskUpdate
        .run({ taskId, object: values })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
  })),
)(TaskModifier);
