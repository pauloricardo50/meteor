import React from 'react';

import { DialogForm, email } from 'core/components/Form';
import T from 'core/components/Translation';
import Button from 'core/components/Button';
import { adminCreateUser } from 'core/api/methods';
import { ROLES } from 'core/api/users/userConstants';

export const createUserFormFields = ['firstName', 'lastName', 'email', 'phone'];

export const getFormArray = formFields =>
  formFields
    .map(fieldName =>
      (fieldName !== 'email'
        ? { id: fieldName }
        : { id: 'email', validate: [email] }))
    .map(field => ({
      ...field,
      label: <T id={`CreateUserDialogForm.${field.id}`} />,
      required: field.id === 'email',
    }));

const formArray = getFormArray(createUserFormFields);

const onSubmit = data =>
  adminCreateUser.run({ options: data, role: ROLES.USER });

const redirectToUserProfile = (newId, history) => history.push(`/users/${newId}`);


const CreateUserDialogForm = ({ history }) => (
  <DialogForm
    form="admin-add-user"
    onSubmit={onSubmit}
    onSubmitSuccess={newUserId => redirectToUserProfile(newUserId, history)}
    button={
      <Button raised primary>
        <T id="CreateUserDialogForm.buttonLabel" />
      </Button>
    }
    title={<T id="CreateUserDialogForm.dialogTitle" />}
    description={<T id="CreateUserDialogForm.dialogDescription" />}
    formArray={formArray}
  />
);

export default CreateUserDialogForm;
