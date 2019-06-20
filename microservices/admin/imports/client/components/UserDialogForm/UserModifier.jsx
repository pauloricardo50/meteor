// @flow
import React from 'react';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation';
import UserDialogFormContainer from './UserDialogFormContainer';

type UserModifierProps = {
  schema: Object,
  user: Object,
  editUser: Function,
  labels: Array<Object>,
};

const UserModifier = ({
  schema,
  user,
  editUser,
  labels,
}: UserModifierProps) => (
  <AutoFormDialog
    // Emails should not be modified like this, but with EmailModifier
    schema={schema.omit('email', 'assignedEmployeeId', 'sendEnrollmentEmail')}
    model={user}
    onSubmit={editUser}
    buttonProps={{
      label: <T id="UserModifier.buttonLabel" />,
      raised: true,
      primary: true,
    }}
    autoFieldProps={{ labels }}
  />
);

export default UserDialogFormContainer(UserModifier);
