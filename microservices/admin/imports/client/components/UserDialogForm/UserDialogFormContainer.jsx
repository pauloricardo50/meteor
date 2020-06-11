import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import { useHistory } from 'react-router-dom';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import {
  adminCreateUser,
  updateUser,
  userUpdateOrganisations,
} from 'core/api/users/methodDefinitions';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';
import T from 'core/components/Translation';

const userSchema = new SimpleSchema({
  firstName: { type: String, optional: true },
  lastName: { type: String, optional: true },
  organisations: {
    type: Array,
    condition: user => !Roles.userIsInRole(user, ROLES.USER),
  },
  email: { type: String, optional: false, regEx: SimpleSchema.RegEx.Email },
  phoneNumbers: { type: Array, optional: true },
  'phoneNumbers.$': String,
  assignedEmployeeId: {
    type: String,
    customAllowedValues: {
      query: USERS_COLLECTION,
      params: {
        $filters: { 'roles._id': ROLES.ADMIN },
        firstName: 1,
        office: 1,
        $options: { sort: { firstName: 1 } },
      },
    },
    optional: true,
    uniforms: {
      transform: user => user?.firstName,
      labelProps: { shrink: true },
      grouping: {
        groupBy: 'office',
        format: office => <T id={`Forms.office.${office}`} />,
      },
    },
  },
  'organisations.$': Object,
  'organisations.$._id': {
    type: String,
    optional: true,
    defaultValue: null,
    customAllowedValues: {
      query: ORGANISATIONS_COLLECTION,
      params: { name: 1 },
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

export default withProps(({ user }) => {
  const history = useHistory();
  return {
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
            !Roles.userIsInRole(user, ROLES.USER) &&
            updateOrganisations({ userId: user._id, organisations }),
        );
    },
  };
});
