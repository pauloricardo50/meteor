import React from 'react';
import PropTypes from 'prop-types';

import { DialogForm } from 'core/components/Form';
import { T } from 'core/components/Translation';
import Button from 'core/components/Button';
import { editUser } from 'core/api/methods';
import { FIELD_TYPES } from 'core/components/Form/formConstants';

export const editUserFormFields = ['firstName', 'lastName', 'phone'];

export const getEditUserFormArray = formFields =>
  formFields.map(field => ({
    id: field,
    label: <T id={`EditUserDialogForm.${field}`} />,
    fieldType: field === 'phone' ? FIELD_TYPES.ARRAY : FIELD_TYPES.TEXT,
  }));

const formArray = getEditUserFormArray(editUserFormFields);

const onSubmit = ({ userId, data }) =>
  editUser.run({
    userId,
    object: data,
  });

const EditUserDialogForm = ({ user: { _id, firstName, lastName, phone } }) => (
  <DialogForm
    form="admin-edit-user"
    onSubmit={data => onSubmit({ userId: _id, data })}
    button={
      <Button raised primary>
        <T id="EditUserDialogForm.buttonLabel" />
      </Button>
    }
    title={<T id="EditUserDialogForm.dialogTitle" />}
    formArray={formArray}
    initialValues={{ firstName, lastName, phone }}
  />
);

export default EditUserDialogForm;
