import React, { useState } from 'react';
import SimpleSchema from 'simpl-schema';
import omit from 'lodash/omit';
import { compose, withState, withProps } from 'recompose';

import { withSmartQuery } from 'core/api';
import { address } from 'core/api/helpers/sharedSchemas';
import {
  contactInsert,
  contactUpdate,
  contactRemove,
  contactChangeOrganisations,
} from 'core/api/methods';
import { adminOrganisations } from 'core/api/organisations/queries';
import T from 'core/components/Translation';
import useSearchParams from 'core/hooks/useSearchParams';

const schema = existingOrganisations =>
  new SimpleSchema({
    firstName: String,
    lastName: String,
    organisations: Array,
    'organisations.$': Object,
    'organisations.$._id': {
      type: String,
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
    useSameAddress: {
      type: String,
      optional: true,
      defaultValue: null,
      condition: ({ organisations = [] }) =>
        organisations.length >= 1 &&
        organisations.some(({ _id }) =>
          existingOrganisations.some(
            ({ _id: organisationId }) => _id === organisationId,
          ),
        ),
      customAllowedValues: ({ organisations = [] }) =>
        organisations.filter(({ _id }) => _id).map(({ _id }) => _id),
      uniforms: {
        transform: organisationId => {
          const { name } =
            existingOrganisations.find(({ _id }) => organisationId === _id) ||
            {};
          return name;
        },
        labelProps: { shrink: true },
        placeholder: 'Non',
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
    newOrganisations: organisations
      .filter(({ _id }) => !!_id)
      .map(({ _id, $metadata: metadata }) => ({
        _id,
        metadata: { ...metadata, useSameAddress: useSameAddress === _id },
      })),
  });

export default compose(
  withSmartQuery({
    query: adminOrganisations,
    queryOptions: { reactive: false },
    params: { $body: { _id: 1 } },
    dataName: 'existingOrganisations',
    smallLoader: true,
  }),
  withState('submitting', 'setSubmitting', false),
  withProps(({ existingOrganisations }) => {
    const initialSearchParams = useSearchParams();
    const [searchParams, setSearchParams] = useState(initialSearchParams);
    const { email, ...newContact } = searchParams || {};

    const model = searchParams && {
      ...newContact,
      emails: email && [{ address: email }],
    };

    return {
      schema: schema(existingOrganisations),
      insertContact: ({ organisations = [], useSameAddress, ...contact }) =>
        contactInsert.run({ contact }).then(contactId =>
          changeOrganisations({
            contactId,
            organisations,
            useSameAddress,
          })
            .then(() => setSearchParams({}))
            .then(() => contactId),
        ),
      modifyContact: data => {
        const {
          _id: contactId,
          organisations = [],
          useSameAddress,
          ...object
        } = data;
        return contactUpdate
          .run({ contactId, object })
          .then(() =>
            changeOrganisations({ contactId, organisations, useSameAddress }),
          );
      },
      removeContact: contactId => contactRemove.run({ contactId }),
      model,
      openOnMount: searchParams.addContact,
      resetForm: () => setSearchParams({}),
    };
  }),
);
