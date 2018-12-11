import SimpleSchema from 'simpl-schema';
import omit from 'lodash/omit';

import { withSmartQuery } from 'core/api';
import { address } from 'core/api/helpers/sharedSchemas';
import { compose, withState, withProps } from 'recompose';
import {
  contactInsert,
  contactUpdate,
  contactRemove,
  addContactToOrgnaisation,
} from 'imports/core/api/methods/index';
import adminOrganisations from 'imports/core/api/organisations/queries/adminOrganisations';

const schema = organisations =>
  new SimpleSchema({
    firstName: String,
    lastName: String,
    organisationId: {
      type: String,
      optional: true,
      defaultValue: null,
      allowedValues: [...organisations.map(({ _id }) => _id), null],
      uniforms: {
        transform: (organisationId) => {
          const organisation = organisations.find(({ _id }) => organisationId === _id);
          return organisation ? organisation.name : 'Aucune organisation';
        },
        labelProps: { shrink: true },
      },
    },
    role: { type: String, optional: true },
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
    dataName: 'organisations',
    smallLoader: true,
  }),
  withState('submitting', 'setSubmitting', false),
  withProps(({ organisations }) => ({
    schema: schema(organisations),
    insertContact: ({ organisationId, role, ...contact }) =>
      contactInsert.run({ contact }).then((contactId) => {
        if (organisationId) {
          return addContactToOrgnaisation.run({
            contactId,
            organisationId,
            metadata: { role },
          });
        }
        return Promise.resolve(contactId);
      }),
    modifyContact: (data) => {
      const { _id: contactId, ...object } = data;
      return contactUpdate.run({ contactId, object });
    },
    removeContact: contactId => contactRemove.run({ contactId }),
  })),
);
