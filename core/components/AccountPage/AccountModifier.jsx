import React from 'react';
import { withProps } from 'recompose';

import { updateUser } from '../../api/users/methodDefinitions';
import { UserSchema } from '../../api/users/users';
import AutoFormDialog from '../AutoForm2/AutoFormDialog';
import T from '../Translation';

const AccountModifier = ({ schema, onSubmit, buttonProps, currentUser }) => (
  <AutoFormDialog
    title={<T id="AccountPage.updateUser" />}
    schema={schema}
    onSubmit={onSubmit}
    buttonProps={buttonProps}
    model={currentUser}
  />
);

export default withProps(({ currentUser }) => ({
  schema: UserSchema.pick('firstName', 'lastName', 'phoneNumbers'),
  onSubmit: values =>
    updateUser.run({
      object: values,
      userId: currentUser._id,
    }),
  buttonProps: {
    raised: true,
    primary: true,
    label: <T id="AccountPage.updateUser" />,
  },
}))(AccountModifier);
