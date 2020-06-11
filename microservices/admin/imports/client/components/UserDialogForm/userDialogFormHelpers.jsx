import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import SimpleSchema from 'simpl-schema';

import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { ROLES } from 'core/api/users/userConstants';
import T from 'core/components/Translation';

export const userFormSchema = new SimpleSchema({
  firstName: { type: String, optional: true },
  lastName: { type: String, optional: true },
  organisations: {
    type: Array,
    condition: user => !Roles.userIsInRole(user, ROLES.USER),
  },
  phoneNumbers: { type: Array, optional: true },
  'phoneNumbers.$': String,

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
