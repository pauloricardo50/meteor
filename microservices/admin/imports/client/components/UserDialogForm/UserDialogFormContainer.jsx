import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { adminOrganisations } from 'core/api/organisations/queries';
import {
  adminCreateUser,
  updateUser,
  userUpdateOrganisations,
} from 'core/api/users/methodDefinitions';
import { adminUsers } from 'core/api/users/queries';
import { ROLES } from 'core/api/users/userConstants';
import T from 'core/components/Translation';

const userSchema = new SimpleSchema({
  firstName: { type: String, optional: true },
  lastName: { type: String, optional: true },
  organisations: {
    type: Array,
    condition: ({ roles = [] }) => !roles.includes(ROLES.USER),
  },
  email: { type: String, optional: false, regEx: SimpleSchema.RegEx.Email },
  phoneNumbers: { type: Array, optional: true },
  'phoneNumbers.$': String,
  assignedEmployeeId: {
    type: String,
    customAllowedValues: {
      query: adminUsers,
      params: () => ({ $body: { name: 1 }, admins: true }),
    },
    optional: true,
    uniforms: {
      transform: ({ name }) => name,
      labelProps: { shrink: true },
    },
  },
  'organisations.$': Object,
  'organisations.$._id': {
    type: String,
    optional: true,
    defaultValue: null,
    customAllowedValues: {
      query: adminOrganisations,
      params: () => ({ $body: { name: 1 } }),
    },
    uniforms: {
      transform: ({ name }) => name,
      labelProps: { shrink: true },
      label: <T id="Forms.organisationName" />,
      displayEmtpy: false,
      placeholder: '',
    },
  },
  'organisations.$.$metadata': {
    type: Object,
    uniforms: { label: null },
    optional: true,
  },
  'organisations.$.$metadata.title': {
    type: String,
    optional: true,
    uniforms: {
      label: <T id="Forms.contact.title" />,
      placeholder: 'Responsable Hypothèques',
      displayEmpty: true,
    },
  },
  'organisations.$.$metadata.isMain': {
    type: Boolean,
    optional: false,
    uniforms: {
      label: 'Organisation principale',
    },
  },
});

const updateOrganisations = ({ userId, organisations = [] }) =>
  userUpdateOrganisations.run({
    userId,
    newOrganisations: organisations.map(({ _id, $metadata: metadata }) => ({
      _id,
      metadata,
    })),
  });

export default compose(
  withRouter,
  withProps(({ history, user }) => ({
    schema: userSchema,
    labels: { assignedEmployeeId: <T id="Forms.assignedEmployee" /> },
    createUser: data =>
      adminCreateUser.run({ options: data, role: ROLES.USER }).then(newId => {
        history.push(`/users/${newId}`);
      }),
    editUser: data => {
      const { organisations = [], ...object } = data;
      return updateUser
        .run({ userId: user._id, object })
        .then(
          () =>
            !user.roles.includes(ROLES.USER) &&
            updateOrganisations({ userId: user._id, organisations }),
        );
    },
  })),
);
