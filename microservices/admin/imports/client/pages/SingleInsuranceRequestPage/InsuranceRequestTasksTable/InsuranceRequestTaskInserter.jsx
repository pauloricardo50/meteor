import React, { useMemo } from 'react';
import SimpleSchema from 'simpl-schema';

import { taskInsert } from 'core/api/tasks/methodDefinitions';
import Box from 'core/components/Box';

import TaskAdder from '../../../components/TaskForm/TaskAdder';
import { taskFormSchema } from '../../../components/TaskForm/taskFormHelpers';

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
  }).extend(taskFormSchema.omit('status'));

const InsuranceRequestTaskInserter = ({ insuranceRequest, ...rest }) => {
  const schema = useMemo(() => getSchema(insuranceRequest), [insuranceRequest]);

  return (
    <TaskAdder
      schema={schema}
      onSubmit={({ linkId, ...values }) =>
        taskInsert.run({
          object: {
            insuranceRequestLink: { _id: insuranceRequest._id },
            ...(linkId !== insuranceRequest._id
              ? { insuranceLink: { _id: linkId } }
              : {}),
            ...values,
          },
        })
      }
      layout={[
        {
          Component: Box,
          className: 'mb-32',
          title: <h5>Général</h5>,
          fields: ['linkId', 'title', 'description'],
          layout: {
            className: 'grid-2',
            fields: ['assigneeLink._id', 'isPrivate'],
          },
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
      ]}
      {...rest}
    />
  );
};

export default InsuranceRequestTaskInserter;
