import React, { useContext, useMemo } from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { taskInsert } from 'core/api/tasks/methodDefinitions';
import Box from 'core/components/Box';
import T from 'core/components/Translation';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';

import { CollectionTaskInserterForm } from '../../../components/TasksTable/CollectionTaskInserter';
import { schema as taskSchema } from '../../../components/TasksTable/TaskModifier';

const getSchema = ({ insurances = [], _id: insuranceRequestId, name }) =>
  new SimpleSchema({
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

export default withProps(
  ({ doc: insuranceRequest, model = {}, resetForm = () => {} }) => {
    const currentUser = useContext(CurrentUserContext);
    const schema = useMemo(() => getSchema(insuranceRequest), [
      insuranceRequest,
    ]);

    return {
      schema,
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
          _id: currentUser?._id,
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
    };
  },
)(CollectionTaskInserterForm);
