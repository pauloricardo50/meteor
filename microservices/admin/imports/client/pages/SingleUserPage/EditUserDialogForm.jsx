import React from 'react';
import PropTypes from 'prop-types';

import { DialogForm } from 'core/components/Form';
import { T } from 'core/components/Translation';
import Button from 'core/components/Button';
import { editUser } from 'core/api/methods';
import { FIELD_TYPES } from 'core/components/Form/formConstants';
import ClientEventService from 'core/api/events/ClientEventService/index';
import { USER_QUERIES } from 'core/api/constants';

export const editUserFormFields = ['firstName', 'lastName', 'phoneNumbers'];

export const getEditUserFormArray = formFields =>
  formFields.map(field => ({
    id: field,
    label: <T id={`EditUserDialogForm.${field}`} />,
    fieldType: field === 'phoneNumbers' ? FIELD_TYPES.ARRAY : FIELD_TYPES.TEXT,
  }));

const formArray = getEditUserFormArray(editUserFormFields);

const onSubmit = ({ data, userId }) => editUser.run({ userId, object: data }).then(() => ClientEventService.emit(USER_QUERIES.ADMIN_USER));

const EditUserDialogForm = ({
  user,
}) => (
  <DialogForm
    form="admin-edit-user"
    onSubmit={data => onSubmit({ data, userId: user._id })}
    button={(
      <Button raised primary>
        <T id="EditUserDialogForm.buttonLabel" />
      </Button>
    )}
    title={<T id="EditUserDialogForm.dialogTitle" />}
    formArray={formArray}
    initialValues={user}
  />
);

EditUserDialogForm.propTypes = {
  user: PropTypes.object.isRequired,
};

export default EditUserDialogForm;
