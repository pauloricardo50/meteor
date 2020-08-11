import React, { useState } from 'react';
import omit from 'lodash/omit';
import { compose, withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import {
  contactChangeOrganisations,
  contactInsert,
  contactRemove,
  contactUpdate,
} from 'core/api/contacts/methodDefinitions';
import { withSmartQuery } from 'core/api/containerToolkit';
import { address } from 'core/api/helpers/sharedSchemas';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
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
        query: ORGANISATIONS_COLLECTION,
        params: () => ({ name: 1, $options: { sort: { name: 1 } } }),
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
        deps: ['organisations'],
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
    query: ORGANISATIONS_COLLECTION,
    queryOptions: { reactive: false },
    params: { _id: 1, name: 1, $options: { sort: { name: 1 } } },
    dataName: 'existingOrganisations',
    smallLoader: true,
  }),
  withProps(({ existingOrganisations, model }) => {
    const initialSearchParams = useSearchParams();
    const [searchParams, setSearchParams] = useState(initialSearchParams);
    const { email, ...newContact } = searchParams || {};

    const finalModel = Object.keys(searchParams).length
      ? {
          ...newContact,
          emails: email && [{ address: email }],
        }
      : model;

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
      model: finalModel,
      openOnMount: searchParams.addContact,
      resetForm: () => setSearchParams({}),
    };
  }),
);
