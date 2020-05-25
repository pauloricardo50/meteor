import React from 'react';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';

import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/autoFormConstants';
import Box from 'core/components/Box';
import T from 'core/components/Translation';

import TaskModifierDateSetter from './TaskModifierDateSetter';

const toNearest15Minutes = momentObj => {
  const roundedMinutes = Math.round(momentObj.clone().minute() / 15) * 15;
  return momentObj
    .clone()
    .minute(roundedMinutes)
    .second(0);
};

export const dueAtTimeFuncs = [
  {
    label: 'dans 1h',
    func: () => {
      const nextDate = toNearest15Minutes(moment().add(1, 'h'));
      return [
        ['dueAtTime', nextDate.format('HH:mm')],
        ['dueAt', nextDate.toDate()],
      ];
    },
  },
  {
    label: 'dans 3h',
    func: () => {
      const nextDate = toNearest15Minutes(moment().add(3, 'h'));
      return [
        ['dueAtTime', nextDate.format('HH:mm')],
        ['dueAt', nextDate.toDate()],
      ];
    },
  },
  {
    label: 'Demain, 8h',
    func: () => {
      const nextDate = moment()
        .add(1, 'd')
        .hours(8)
        .minutes(0);

      return [
        ['dueAtTime', nextDate.format('HH:mm')],
        ['dueAt', nextDate.toDate()],
      ];
    },
  },
];

const getNextMonday = () => {
  const dayINeed = 1; // Monday
  const today = moment().isoWeekday();

  // if we haven't yet passed the day of the week that I need:
  if (today < dayINeed) {
    // then just give me this week's instance of that day
    return moment().isoWeekday(dayINeed);
  }
  // otherwise, give me *next week's* instance of that same day
  return moment()
    .add(1, 'weeks')
    .isoWeekday(dayINeed);
};

export const dueAtFuncs = [
  {
    label: 'Demain',
    func: () => [
      [
        'dueAt',
        moment()
          .add(1, 'd')
          .toDate(),
      ],
    ],
  },
  {
    label: 'Dans 3 jours',
    func: () => [
      [
        'dueAt',
        moment()
          .add(3, 'd')
          .toDate(),
      ],
    ],
  },
  {
    label: 'Lundi pro',
    func: () => [['dueAt', getNextMonday().toDate()]],
  },
  {
    label: 'Semaine pro',
    func: () => [
      [
        'dueAt',
        moment()
          .add(7, 'd')
          .toDate(),
      ],
    ],
  },
];

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

export const taskFormSchema = new SimpleSchema({
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
    title: <h4>Général</h4>,
    fields: ['title', 'description'],
    layout: { className: 'grid-2', fields: ['assigneeLink._id', 'isPrivate'] },
  },
  {
    Component: Box,
    title: <h4>Échéance</h4>,
    layout: [
      'dueAtTimeHelpers',
      'dueAtDateHelpers',
      { className: 'grid-2', fields: ['dueAt', 'dueAtTime'] },
    ],
  },
];

export const taskFormLabels = {
  title: <T id="TasksTable.title" />,
  dueAt: <T id="TasksTable.dueAt" />,
  status: <T id="TasksTable.status" />,
  assignedEmployeeId: <T id="TasksTable.assignedTo" />,
};
