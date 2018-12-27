import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { address } from '../helpers/sharedSchemas';

import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_TYPES,
  ORGANISATION_FEATURES,
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
  features: { type: Array, optional: true, defaultValue: [] },
  'features.$': {
    type: String,
    allowedValues: Object.values(ORGANISATION_FEATURES),
  },
  logo: {
    type: String,
    optional: true,
  },
  ...address,
  contactIds: { type: Array, defaultValue: [] },
  'contactIds.$': Object,
  'contactIds.$._id': { type: String, optional: true },
  'contactIds.$.role': { type: String, optional: true },
  'contactIds.$.useSameAddress': { type: Boolean, optional: true },
});

Organisations.attachSchema(OrganisationSchema);
export default Organisations;
