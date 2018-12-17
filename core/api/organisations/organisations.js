import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_TYPES,
} from './organisationConstants';

const Organisations = new Mongo.Collection(ORGANISATIONS_COLLECTION);

Organisations.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Organisations.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

export const OrganisationSchema = new SimpleSchema({
  name: { type: String },
  type: {
    type: String,
    optional: true,
    allowedValues: Object.values(ORGANISATION_TYPES),
  },
  logo: {
    type: String,
    optional: true,
  },
  contactIds: { type: Array, defaultValue: [] },
  'contactIds.$': Object,
  'contactIds.$._id': String,
  'contactIds.$.role': { type: String, optional: true },
});

Organisations.attachSchema(OrganisationSchema);
export default Organisations;
