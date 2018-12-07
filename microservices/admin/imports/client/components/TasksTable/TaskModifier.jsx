// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import { AutoFormDialog } from 'imports/core/components/AutoForm2/AutoFormDialog';
import { taskUpdate } from 'core/api/tasks/methodDefinitions';
import { CUSTOM_AUTOFIELD_TYPES } from 'imports/core/components/AutoForm2/constants';
import { TASK_STATUS } from 'core/api/constants';
import { withSmartQuery } from 'core/api';
import query from 'core/api/users/queries/admins';
import T from 'imports/core/components/Translation/Translation';

type TaskModifierProps = {
  task: Object,
  updateTask: Function,
  open: boolean,
  setOpen: Function,
  submitting: boolean,
  admins: Array<String>,
};

const taskSchema = (admins = []) =>
  new SimpleSchema({
    title: String,
    dueAt: { type: Date, uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE } },
    status: {
      type: String,
      allowedValues: Object.values(TASK_STATUS),
    },
    assignedEmployeeId: {
      type: String,
      allowedValues: [...admins.map(({ _id }) => _id), null],
      optional: true,
      defaultValue: null,
      uniforms: {
        transform: assignedEmployeeId =>
          (assignedEmployeeId ? (
            admins.find(({ _id }) => assignedEmployeeId === _id).name
          ) : (
            <T id="Forms.unassigned" />
          )),
        labelProps: { shrink: true },
      },
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
  admins,
}: TaskModifierProps) => {
  const schema = taskSchema(admins);
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
  withSmartQuery({
    query,
    queryOptions: { reactive: true },
    dataName: 'admins',
    smallLoader: true,
  }),
  withState('submitting', 'setSubmitting', false),
  withProps(({ setOpen, setSubmitting }) => ({
    updateTask: ({ _id: taskId, ...values }) => {
      setSubmitting(true);
      return taskUpdate
        .run({ taskId, object: values })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
  })),
)(TaskModifier);
