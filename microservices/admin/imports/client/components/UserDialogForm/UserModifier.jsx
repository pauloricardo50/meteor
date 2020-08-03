import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import { withProps } from 'recompose';

import {
  updateUser,
  userUpdateOrganisations,
} from 'core/api/users/methodDefinitions';
import { ROLES } from 'core/api/users/userConstants';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import T from 'core/components/Translation';

import { userFormLayout } from './UserAdder';
import { userFormSchema } from './userDialogFormHelpers';

const UserModifier = ({ user, editUser }) => (
  <AutoFormDialog
    schema={userFormSchema}
    model={user}
    onSubmit={editUser}
    buttonProps={{
      label: <T id="UserModifier.buttonLabel" />,
      raised: true,
      primary: true,
    }}
    layout={userFormLayout}
    title={<T id="UserModifier.dialogTitle" />}
  />
);
const updateOrganisations = ({ userId, organisations = [] }) =>
  userUpdateOrganisations.run({
    userId,
    newOrganisations: organisations.map(({ _id, $metadata: metadata }) => ({
      _id,
      metadata,
    })),
  });

export default withProps(({ user }) => ({
  editUser: ({ organisations = [], ...object }) =>
    updateUser
      .run({ userId: user._id, object })
      .then(
        () =>
          !Roles.userIsInRole(user, ROLES.USER) &&
          updateOrganisations({ userId: user._id, organisations }),
      ),
}))(UserModifier);
