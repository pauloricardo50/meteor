import React from 'react';
import PropTypes from 'prop-types';

import { DialogForm, email } from 'core/components/Form';
import { T } from 'core/components/Translation';
import Button from 'core/components/Button';
import { adminCreateUser } from 'core/api/methods';
import { ROLES } from 'core/api/users/userConstants';

export const createUserFormFields = ['firstName', 'lastName', 'email', 'phone'];

export const getFormArray = formFields =>
  formFields
    .map(fieldName => {
      if (fieldName !== 'email') {
        return { id: fieldName };
      }

      return { id: 'email', validate: [email] };
    })
    .map(field => ({
      ...field,
      label: <T id={`CreateUserDialogForm.${field.id}`} />,
      required: field.id === 'email',
    }));

const formArray = getFormArray(createUserFormFields);

const onSubmit = data => {
  adminCreateUser.run({
    options: data,
    role: ROLES.USER,
  });
};

const CreateUserDialogForm = () => (
  <DialogForm
    form="admin-add-user"
    onSubmit={onSubmit}
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
