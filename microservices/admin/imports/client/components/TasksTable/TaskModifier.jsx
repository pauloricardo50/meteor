// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import { AutoFormDialog } from 'imports/core/components/AutoForm2/AutoFormDialog';
import { taskUpdate } from 'core/api/tasks/methodDefinitions';

type TaskModifierProps = {
  task: Object,
  updateTask: Function,
  open: boolean,
  setOpen: Function,
  submitting: boolean,
};

const taskSchema = new SimpleSchema({
  title: String,
});

const TaskModifier = ({
  task,
  updateTask,
  open,
  setOpen,
  submitting,
}: TaskModifierProps) => {
  const schema = taskSchema;
  const model = task;
  return (
    <AutoFormDialog
      schema={schema}
      model={model}
      onSubmit={updateTask}
      open={open}
      setOpen={setOpen}
      submitting={submitting}
    />
  );
};

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ setOpen, setSubmitting }) => ({
    updateTask: ({ _id: taskId, ...values }) => {
      const { title } = values;
      const object = { title };
      setSubmitting(true);
      return taskUpdate
        .run({ taskId, object })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
  })),
)(TaskModifier);
