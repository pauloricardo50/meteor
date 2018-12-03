// @flow
import React from 'react';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation';
import UserDialogFormContainer from './UserDialogFormContainer';

type EditUserDialogFormProps = {
  schema: Object,
  user: Object,
  editUser: Function,
};

const EditUserDialogForm = ({
  schema,
  user,
  editUser,
}: EditUserDialogFormProps) => (
  <AutoFormDialog
    schema={schema}
    model={user}
    onSubmit={editUser}
    buttonProps={{
      label: <T id="EditUserDialogForm.buttonLabel" />,
      raised: true,
      primary: true,
    }}
  />
);

export default UserDialogFormContainer(EditUserDialogForm);
