// @flow
import React from 'react';

import AutoForm from 'core/components/AutoForm2/AutoForm';
import UserCreatorContainer from './UserCreatorContainer';

type UserCreatorFormProps = {};

const UserCreatorForm = ({
  schema,
  buttonProps,
  onSubmit,
  submitFieldProps,
}: UserCreatorProps) => (
  <AutoForm
    schema={schema}
    onSubmit={onSubmit}
    submitFieldProps={{
      label: 'Créez votre compte',
      raised: true,
      secondary: true,
      style: { width: '100%', marginTop: 16 },
      ...submitFieldProps,
    }}
    style={{ width: '100%' }}
  />
);

export default UserCreatorContainer(UserCreatorForm);
