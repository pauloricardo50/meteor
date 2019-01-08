import React from 'react';
import SimpleSchema from 'simpl-schema';
import omit from 'lodash/omit';

import { withSmartQuery } from 'core/api';
import { address } from 'core/api/helpers/sharedSchemas';
import { compose, withState, withProps } from 'recompose';
import {
  contactInsert,
  contactUpdate,
  contactRemove,
  contactChangeOrganisations,
} from 'imports/core/api/methods/index';
import adminOrganisations from 'imports/core/api/organisations/queries/adminOrganisations';
import T from 'imports/core/components/Translation';

SimpleSchema.extendOptions([
  'condition',
  'customAllowedValues',
  'customAllowedValuesFromQuery',
]);

const schema = existingOrganisations =>
  new SimpleSchema({
    firstName: String,
    lastName: String,
    organisations: Array,
    'organisations.$': Object,
    'organisations.$._id': {
      type: String,
      optional: true,
      defaultValue: null,
      // customAllowedValuesFromQuery: {
      //   query: adminOrganisations,
      // },
      allowedValues: () => existingOrganisations.map(({ _id }) => _id),
      uniforms: {
        transform: (organisationId) => {
          const { name } = existingOrganisations.find(({ _id }) => organisationId === _id)
            || {};
          return name;
        },
        labelProps: { shrink: true },
        label: <T id="Forms.organisationName" />,
      },
    },
    useSameAddress: {
      type: String,
      optional: true,
      defaultValue: null,
      condition: ({ organisations = [] }) =>
        organisations.length >= 1
        && organisations.some(({ _id }) =>
          existingOrganisations.some(({ _id: organisationId }) => _id === organisationId)),
      customAllowedValues: ({ organisations = [] }) => [
        ...organisations.filter(({ _id }) => _id).map(({ _id }) => _id),
        null,
      ],
      uniforms: {
        transform: (organisationId) => {
          const { name } = existingOrganisations.find(({ _id }) => organisationId === _id)
            || {};
          return name || 'Non';
        },
        labelProps: { shrink: true },
      },
    },
    'organisations.$.$metadata': {
      type: Object,
      uniforms: { label: null },
      optional: true,
    },
    'organisations.$.$metadata.role': {
      type: String,
      optional: true,
      uniforms: { label: <T id="Forms.contact.role" />, placeholder: 'Responsable Hypothèques' },
    },
    ...Object.keys(omit(address, ['isForeignAddress', 'canton'])).reduce(
      (fields, field) => ({
        ...fields,
        [field]: {
          ...address[field],
          condition: ({ useSameAddress, organisations = [] }) =>
            organisations.length === 0 || !useSameAddress,
        },
      }),
      {},
    ),
    emails: { type: Array, optional: true },
    'emails.$': Object,
    'emails.$.address': {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
      uniforms: { label: <T id="Forms.email" /> },
    },
    phoneNumbers: { type: Array, optional: true },
    'phoneNumbers.$': String,
  });

const changeOrganisations = ({ contactId, organisations, useSameAddress }) =>
  contactChangeOrganisations.run({
    contactId,
    newOrganisations: organisations.map(({ _id, $metadata: metadata }) => ({
      _id,
      metadata: { ...metadata, useSameAddress: useSameAddress === _id },
    })),
  });

export default compose(
  withSmartQuery({
    query: adminOrganisations,
    queryOptions: { reactive: false },
    dataName: 'existingOrganisations',
    smallLoader: true,
  }),
  withState('submitting', 'setSubmitting', false),
  withProps(({ existingOrganisations }) => ({
    schema: schema(existingOrganisations),
    insertContact: ({ organisations = [], useSameAddress, ...contact }) =>
      contactInsert.run({ contact }).then(contactId =>
        changeOrganisations({
          contactId,
          organisations,
          useSameAddress,
        }).then(() => contactId)),
    modifyContact: (data) => {
      const {
        _id: contactId,
        organisations = [],
        useSameAddress,
        ...object
      } = data;
      return contactUpdate
        .run({ contactId, object })
        .then(() =>
          changeOrganisations({ contactId, organisations, useSameAddress }));
    },
    removeContact: contactId => contactRemove.run({ contactId }),
  })),
);
