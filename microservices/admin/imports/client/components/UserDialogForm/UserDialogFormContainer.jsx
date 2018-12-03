import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';
import SimpleSchema from 'simpl-schema';
import { withSmartQuery } from 'core/api';
import { adminCreateUser, editUser } from 'core/api/methods';
import { ROLES } from 'core/api/users/userConstants';
import query from 'core/api/users/queries/admins';
import T from 'imports/core/components/Translation/Translation';

const userSchema = (admins = []) =>
  new SimpleSchema({
    firstName: { type: String, optional: false },
    lastName: { type: String, optional: false },
    email: { type: String, optional: false },
    phoneNumbers: { type: Array, optional: false, minCount: 1 },
    'phoneNumbers.$': String,
    assignedEmployeeId: {
      type: String,
      allowedValues: admins.map(({ _id }) => _id),
      optional: false,
      uniforms: {
        transform: assignedEmployeeId =>
          admins.find(({ _id }) => assignedEmployeeId === _id).name,
        labelProps: { shrink: true },
      },
    },
  });

export default compose(
  withRouter,
  withSmartQuery({
    query,
    queryoptions: { reactive: true },
    dataName: 'admins',
    smallLoader: true,
  }),
  withProps(({ history, admins, user }) => ({
    schema: userSchema(admins),
    labels: { assignedEmployeeId: <T id="Forms.assignedEmployee" /> },
    createUser: data =>
      adminCreateUser.run({ options: data, role: ROLES.USER }).then((newId) => {
        history.push(`/users/${newId}`);
      }),
    editUser: data => editUser.run({ userId: user._id, object: data }),
  })),
);
