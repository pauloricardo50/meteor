// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import { taskUpdate } from 'core/api/tasks/methodDefinitions';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { TASK_STATUS } from 'core/api/constants';
import { adminUsers } from 'core/api/users/queries';
import T from 'core/components/Translation/Translation';
import TaskModifierDateSetter from './TaskModifierDateSetter';
import { dueAtFuncs, dueAtTimeFuncs } from './taskModifierHelpers';

type TaskModifierProps = {
  task: Object,
  updateTask: Function,
  open: boolean,
  setOpen: Function,
  submitting: boolean,
};

const taskPlaceholders = [
  'Faire la vaisselle',
  'Sortir les poubelles',
  'Manger un kebab',
  'Remercier les ingénieurs pour tous leurs efforts',
  'Coller un 3e pillier au client',
  'Oublier son parapluie',
  'Jouer à Mario Kart',
  'Mettre tous ses post-its dans Admin',
  'Se tenir droit',
  'Boire un energy drink',
  'Se moquer de DL',
  'Se plaindre des banquiers',
  'Aller au sport',
];

export const schema = new SimpleSchema({
  title: {
    type: String,
    uniforms: {
      placeholder:
        taskPlaceholders[Math.floor(Math.random() * taskPlaceholders.length)],
      autoFocus: true,
    },
    optional: true,
  },
  description: {
    type: String,
    optional: true,
  },
  dueAtTimeHelpers: {
    type: String,
    optional: true,
    uniforms: {
      render: TaskModifierDateSetter,
      buttonProps: { raised: true, primary: true },
      funcs: dueAtTimeFuncs,
    },
  },
  dueAtDateHelpers: {
    type: String,
    optional: true,
    uniforms: {
      render: TaskModifierDateSetter,
      buttonProps: { outlined: true, primary: true },
      funcs: dueAtFuncs,
    },
  },
  dueAt: {
    type: Date,
    optional: true,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
  dueAtTime: {
    type: String,
    optional: true,
    uniforms: { type: 'time', placeholder: null },
  },
  status: {
    type: String,
    allowedValues: Object.values(TASK_STATUS),
    defaultValue: TASK_STATUS.ACTIVE,
    uniforms: { displayEmpty: false, placeholder: '' },
  },
  assigneeLink: {
    type: Object,
    optional: true,
    uniforms: { label: null },
  },
  'assigneeLink._id': {
    type: String,
    optional: true,
    customAllowedValues: {
      query: adminUsers,
      params: () => ({ $body: { name: 1 }, admins: true }),
    },
    uniforms: {
      transform: ({ name }) => name,
      labelProps: { shrink: true },
      label: 'Assigner utilisateur',
      placeholder: null,
    },
  },
  isPrivate: {
    type: Boolean,
    defaultValue: false,
  },
});

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

const TaskModifier = ({
  task,
  updateTask,
  open,
  setOpen,
  submitting,
}: TaskModifierProps) => {
  const model = { ...task, dueAtTime: getTime(task.dueAt) };
  return (
    <AutoFormDialog
      schema={schema}
      model={model}
      autoFieldProps={{ labels }}
      onSubmit={updateTask}
      open={open}
      setOpen={setOpen}
      submitting={submitting}
      title="Modifier tâche"
    />
  );
};

export default compose(
  withState('submitting', 'setSubmitting', false),
  withProps(({ setOpen, setSubmitting, task: { _id: taskId } }) => ({
    updateTask: values => {
      setSubmitting(true);
      return taskUpdate
        .run({ taskId, object: values })
        .then(() => setOpen(false))
        .finally(() => setSubmitting(false));
    },
  })),
)(TaskModifier);
