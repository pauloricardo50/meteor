// @flow
import React from 'react';

import AutoForm from 'core/components/AutoForm2/AutoForm';
import T from 'core/components/Translation';
import UserCreatorContainer from './UserCreatorContainer';

type UserCreatorFormProps = {};

const UserCreatorForm = ({
  schema,
  buttonProps,
  onSubmit,
}: UserCreatorProps) => (
  <AutoForm
    schema={schema}
    onSubmit={onSubmit}
    submitFieldProps={{
      label: 'Créez votre compte',
      raised: true,
      secondary: true,
      style: { width: '100%' },
    }}
    style={{ width: '100%' }}
  />
);

export default UserCreatorContainer(UserCreatorForm);
