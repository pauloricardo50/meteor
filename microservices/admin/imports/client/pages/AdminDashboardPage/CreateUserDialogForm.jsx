import React from 'react';

import { DialogForm, email, FIELD_TYPES } from 'core/components/Form';
import T from 'core/components/Translation';
import Button from 'core/components/Button';
import { adminCreateUser } from 'core/api/methods';
import { ROLES } from 'core/api/users/userConstants';
import adminUsers from 'core/api/users/queries/adminUsers';

export const createUserFormFields = [
  { id: 'firstName' },
  { id: 'lastName' },
  { id: 'email', validate: [email] },
  { id: 'phoneNumbers' },
  {
    id: 'assignedEmployeeId',
    fieldType: FIELD_TYPES.SELECT,
    fetchOptions: () =>
      new Promise((resolve, reject) =>
        adminUsers
          .clone()
          .fetch((err, res) =>
            (err
              ? reject(err)
              : resolve(res.map(({ name, _id }) => ({ label: name, id: _id })))))),
  },
];

export const getFormArray = formFields =>
  formFields.map(field => ({
    ...field,
    label: <T id={`CreateUserDialogForm.${field.id}`} />,
    required: field.id === 'email',
  }));

const formArray = getFormArray(createUserFormFields);

const onSubmit = data =>
  adminCreateUser.run({ options: data, role: ROLES.USER });

const redirectToUserProfile = (newId, history) =>
  history.push(`/users/${newId}`);

const CreateUserDialogForm = ({ history, currentUser: { _id: adminId } }) => (
  <DialogForm
    form="admin-add-user"
    onSubmit={onSubmit}
    onSubmitSuccess={newUserId => redirectToUserProfile(newUserId, history)}
    button={(
      <Button raised primary>
        <T id="CreateUserDialogForm.buttonLabel" />
      </Button>
    )}
    title={<T id="CreateUserDialogForm.dialogTitle" />}
    description={<T id="CreateUserDialogForm.dialogDescription" />}
    formArray={formArray}
    initialValues={{ assignedEmployeeId: adminId }}
  />
);

export default CreateUserDialogForm;
