//
import React from 'react';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation';
import UserCreatorContainer from './UserCreatorContainer';

const UserCreator = ({ schema, buttonProps, onSubmit }) => (
  <AutoFormDialog
    title={<T id="UserCreator.title" />}
    description={
      <ul>
        <li>
          <T id="UserCreator.description1" />
        </li>
        <li>
          <T id="UserCreator.description2" />
        </li>
        <li>
          <T id="UserCreator.description3" />
        </li>
      </ul>
    }
    schema={schema}
    onSubmit={onSubmit}
    buttonProps={buttonProps}
  />
);

export default UserCreatorContainer(UserCreator);
