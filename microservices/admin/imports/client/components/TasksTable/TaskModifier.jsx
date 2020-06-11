import React from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { taskUpdate } from 'core/api/tasks/methodDefinitions';
import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/autoFormConstants';
import { AutoFormDialog } from 'core/components/AutoForm2/AutoFormDialog';
import Box from 'core/components/Box';
import T from 'core/components/Translation';

import TaskModifierDateSetter from './TaskModifierDateSetter';
import { dueAtFuncs, dueAtTimeFuncs } from './taskModifierHelpers';

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
    uniforms: {
      multiline: true,
      rows: 5,
      rowsMax: 10,
    },
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
    uniforms: { label: null, style: { margin: 0 }, margin: 'none' },
  },
  'assigneeLink._id': {
    type: String,
    optional: true,
    customAllowedValues: {
      query: USERS_COLLECTION,
      params: {
        $filters: { 'roles._id': ROLES.ADVISOR },
        firstName: 1,
        office: 1,
        $options: { sort: { firstName: 1 } },
      },
    },
    uniforms: {
      transform: user => user?.firstName,
      labelProps: { shrink: true },
      label: 'Assigner conseiller',
      placeholder: null,
      grouping: {
        groupBy: 'office',
        format: office => <T id={`Forms.office.${office}`} />,
      },
    },
  },
  isPrivate: {
    type: Boolean,
    defaultValue: false,
  },
});

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
      schema={schema}
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
