// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation';
import UserDialogFormContainer from './UserDialogFormContainer';

type CreateUserDialogFormProps = {
  schema: Object,
  currentUser: Object,
  createUser: Function,
  labels: Array<Object>,
};

const CreateUserDialogForm = ({
  schema,
  currentUser: { _id: adminId },
  createUser,
  labels,
}: CreateUserDialogFormProps) => (
  <AutoFormDialog
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
      label: <T id="CreateUserDialogForm.buttonLabel" />,
      raised: true,
      primary: true,
    }}
    autoFieldProps={{
      labels: {
        ...labels,
        sendEnrollmentEmail: (
          <T id="CreateUserDialogForm.sendEnrollmentEmail" />
        ),
      },
    }}
    placeholder={false}
  />
);

export default UserDialogFormContainer(CreateUserDialogForm);
