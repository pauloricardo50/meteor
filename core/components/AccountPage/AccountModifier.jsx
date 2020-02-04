//      
import React from 'react';
import { withProps } from 'recompose';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation';
import { UserSchema } from 'core/api/users/users';
import { updateUser } from 'core/api/users/index';

                               

const AccountModifier = ({
  schema,
  onSubmit,
  buttonProps,
  currentUser,
}                      ) => (
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
