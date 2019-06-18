// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import { taskUpdate } from 'core/api/tasks/methodDefinitions';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { TASK_STATUS } from 'core/api/constants';
import { adminUsers } from 'core/api/users/queries';
import T from 'core/components/Translation/Translation';
import TaskModifierDateSetter from './TaskModifierDateSetter';

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
      funcs: [
        {
          label: 'dans 1h',
          func: () => [
            'dueAtTime',
            moment()
              .add(1, 'h')
              .minute(0)
              .format('HH:mm'),
          ],
        },
        {
          label: 'dans 3h',
          func: () => [
            'dueAtTime',
            moment()
              .add(3, 'h')
              .minute(0)
              .format('HH:mm'),
          ],
        },
        {
          label: 'À 8h',
          func: () => [
            'dueAtTime',
            moment()
              .hours(8)
              .minute(0)
              .format('HH:mm'),
          ],
        },
      ],
    },
  },
  dueAtDateHelpers: {
    type: String,
    optional: true,
    uniforms: {
      render: TaskModifierDateSetter,
      buttonProps: { outlined: true, primary: true },
      funcs: [
        {
          label: 'Demain',
          func: () => [
            'dueAt',
            moment()
              .add(1, 'd')
              .toDate(),
          ],
        },
        {
          label: 'Dans 3 jours',
          func: () => [
            'dueAt',
            moment()
              .add(3, 'd')
              .toDate(),
          ],
        },
        {
          label: 'Semaine prochaine',
          func: () => [
            'dueAt',
            moment()
              .add(7, 'd')
              .toDate(),
          ],
        },
      ],
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
    uniforms: { type: 'time' },
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
