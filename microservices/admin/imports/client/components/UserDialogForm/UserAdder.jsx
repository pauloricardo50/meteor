// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation';
import UserDialogFormContainer from './UserDialogFormContainer';

type UserAdderProps = {
  schema: Object,
  currentUser: Object,
  createUser: Function,
  labels: Array<Object>,
};

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
  />
);

export default UserDialogFormContainer(UserAdder);
