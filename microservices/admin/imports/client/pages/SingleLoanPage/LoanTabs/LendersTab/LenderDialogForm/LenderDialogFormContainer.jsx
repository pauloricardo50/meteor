import React from 'react';
import SimpleSchema from 'simpl-schema';
import { compose, withState, withProps } from 'recompose';

import { withSmartQuery } from 'core/api';
import adminOrganisations from 'imports/core/api/organisations/queries/adminOrganisations';
import {
  lenderInsert,
  lenderLinkOrganisationAndContact,
} from 'imports/core/api/methods/index';
import { LENDERS_STATUS } from 'imports/core/api/constants';
import T from 'core/components/Translation';

SimpleSchema.extendOptions(['condition', 'customAllowedValues']);

const schema = existingOrganisations =>
  new SimpleSchema({
    organisationId: {
      type: String,
      optional: false,
      defaultValue: null,
      allowedValues: existingOrganisations.map(({ _id }) => _id),
      uniforms: {
        transform: organisationId =>
          existingOrganisations.find(({ _id }) => organisationId === _id).name,
        labelProps: { shrink: true },
      },
    },
    contactId: {
      type: String,
      optional: true,
      defaultValue: null,
      condition: ({ organisationId }) => !!organisationId,
      customAllowedValues: ({ organisationId }) => [
        ...existingOrganisations
          .find(({ _id }) => organisationId === _id)
          .contacts.map(({ _id }) => _id),
        null,
      ],
      uniforms: {
        transform: contactId => {
          const { name } =
            existingOrganisations
              .reduce((contacts, org) => [...contacts, ...org.contacts], [])
              .find(({ _id }) => _id === contactId) || {};
          return name || 'Non spécifié';
        },
        labelProps: { shrink: true },
      },
    },
    status: {
      type: String,
      optional: false,
      allowedValues: Object.values(LENDERS_STATUS),
      defaultValue: LENDERS_STATUS.TO_BE_CONTACTED,
    },
  });

export default compose(
  withSmartQuery({
    query: adminOrganisations,
    queryOptions: { reactive: false },
    dataName: 'existingOrganisations',
    smallLoader: true,
  }),
  withState('submitting', 'setSubmitting', false),
  withProps(({ existingOrganisations, loanId }) => ({
    schema: schema(existingOrganisations),
    insertLender: ({ organisationId, contactId, status }) =>
      lenderInsert.run({ lender: { status, loanId } }).then(lenderId =>
        lenderLinkOrganisationAndContact.run({
          lenderId,
          organisationId,
          contactId,
        }),
      ),
    autoFieldProps: { labels: { status: <T id="Lenders.status" /> } },
  })),
);
