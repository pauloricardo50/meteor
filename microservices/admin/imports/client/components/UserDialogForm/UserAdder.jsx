// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation';
import Box from 'core/components/Box';
import UserDialogFormContainer from './UserDialogFormContainer';

type UserAdderProps = {
  schema: Object,
  currentUser: Object,
  createUser: Function,
  labels: Array<Object>,
};

export const userFormLayout = [
  {
    Component: Box,
    title: <h4>Détails</h4>,
    className: 'mb-32',
    layout: [
      { className: 'grid-2', fields: ['firstName', 'lastName'] },
      'email',
      'phoneNumbers',
      'organisations',
    ],
  },
  {
    Component: Box,
    title: <h4>Options</h4>,
    fields: ['assignedEmployeeId', 'sendEnrollmentEmail'],
  },
];

const UserAdder = ({
  schema,
  currentUser: { _id: adminId },
  createUser,
  labels,
}: UserAdderProps) => (
  <AutoFormDialog
    title={<T id="UserAdder.buttonLabel" />}
    schema={schema.extend(new SimpleSchema({
      sendEnrollmentEmail: {
        type: Boolean,
        optional: true,
        defaultValue: false,
      },
    }))}
    model={{ assignedEmployeeId: adminId }}
    onSubmit={createUser}
    buttonProps={{
      label: <T id="UserAdder.buttonLabel" />,
      raised: true,
      primary: true,
    }}
    autoFieldProps={{
      labels: {
        ...labels,
        sendEnrollmentEmail: <T id="UserAdder.sendEnrollmentEmail" />,
      },
    }}
    layout={userFormLayout}
  />
);

export default UserDialogFormContainer(UserAdder);
