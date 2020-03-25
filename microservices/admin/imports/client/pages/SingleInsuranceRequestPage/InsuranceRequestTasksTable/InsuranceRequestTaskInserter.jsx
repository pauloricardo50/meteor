import { Meteor } from 'meteor/meteor';
import React from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { taskInsert } from 'core/api';
import T from 'core/components/Translation';
import Box from 'core/components/Box';
import { CollectionTaskInserterForm } from '../../../components/TasksTable/CollectionTaskInserter';
import { schema as taskSchema } from '../../../components/TasksTable/TaskModifier';

const getSchema = insuranceRequest => {
  const { insurances = [], _id: insuranceRequestId, name } = insuranceRequest;

  return new SimpleSchema({
    linkId: {
      type: String,
      defaultValue: insuranceRequestId,
      allowedValues: [insuranceRequestId, ...insurances.map(({ _id }) => _id)],
      uniforms: {
        label: 'Tâche relative à',
        transform: linkId => {
          if (linkId === insuranceRequestId) {
            return `Dossier assurance ${name}`;
          }

          const { name: insuranceName, borrower } = insurances.find(
            ({ _id }) => _id === linkId,
          );

          return `Assurance ${borrower.name} ${insuranceName}`;
        },
        allowNull: false,
        displayEmpty: false,
        placeholder: '',
        checkboxes: true,
      },
    },
  }).extend(taskSchema.omit('status'));
};

export default withProps(
  ({ doc: insuranceRequest, model = {}, resetForm = () => {} }) => ({
    schema: getSchema(insuranceRequest),
    onSubmit: ({ linkId, ...values }) =>
      taskInsert
        .run({
          object: {
            insuranceRequestLink: { _id: insuranceRequest._id },
            ...(linkId !== insuranceRequest._id
              ? { insuranceLink: { _id: linkId } }
              : {}),
            ...values,
          },
        })
        .then(() => resetForm()),
    model: {
      ...model,
      assigneeLink: {
        _id: Meteor.userId(),
      },
    },
    label: <T id="CollectionTaskInserter.label" />,
    title: <T id="CollectionTaskInserter.title" />,
    layout: [
      {
        Component: Box,
        className: 'mb-32',
        title: <h4>Général</h4>,
        fields: ['linkId', 'title', 'description'],
        layout: {
          className: 'grid-2',
          fields: ['assigneeLink._id', 'isPrivate'],
        },
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
    ],
  }),
)(CollectionTaskInserterForm);
