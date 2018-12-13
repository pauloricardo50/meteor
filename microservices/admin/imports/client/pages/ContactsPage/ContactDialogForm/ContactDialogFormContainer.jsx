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
      allowedValues: existingOrganisations.map(({ _id }) => _id),
      uniforms: {
        transform: organisationId =>
          existingOrganisations.find(({ _id }) => organisationId === _id).name,
        labelProps: { shrink: true },
      },
    },
    'organisations.$.$metadata': Object,
    'organisations.$.$metadata.role': { type: String, optional: true },
    ...omit(address, ['isForeignAddress']),
    emails: { type: Array, optional: true },
    'emails.$': Object,
    'emails.$.address': { type: String, regEx: SimpleSchema.RegEx.Email },
    phoneNumbers: { type: Array, optional: true },
    'phoneNumbers.$': String,
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
    insertContact: ({ organisations = [], ...contact }) =>
      contactInsert.run({ contact }).then(contactId =>
        contactChangeOrganisations
          .run({
            contactId,
            newOrganisations: organisations.map(({ _id, $metadata }) => ({
              _id,
              metadata: $metadata,
            })),
          })
          .then(() => contactId)),
    modifyContact: (data) => {
      const { _id: contactId, organisations = [], ...object } = data;
      return contactUpdate.run({ contactId, object }).then(() =>
        contactChangeOrganisations.run({
          contactId,
          newOrganisations: organisations.map(({ _id, $metadata }) => ({
            _id,
            metadata: $metadata,
          })),
        }));
    },
    removeContact: contactId => contactRemove.run({ contactId }),
  })),
);
