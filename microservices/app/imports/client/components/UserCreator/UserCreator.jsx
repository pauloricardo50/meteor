// @flow
import React from 'react';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation';
import UserCreatorContainer from './UserCreatorContainer';

type UserCreatorProps = {};

const UserCreator = ({ schema, buttonProps, onSubmit }: UserCreatorProps) => (
  <AutoFormDialog
    title={<T id="UserCreator.title" />}
    description={<T id="UserCreator.description" />}
    schema={schema}
    onSubmit={onSubmit}
    buttonProps={buttonProps}
  />
);

export default UserCreatorContainer(UserCreator);
