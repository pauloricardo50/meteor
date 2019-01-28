import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { address } from '../helpers/sharedSchemas';

import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_TYPES,
  ORGANISATION_FEATURES,
  ORGANISATION_TAGS,
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
  name: { type: String, uniforms: { placeholder: 'Crédit Suisse' } },
  type: {
    type: String,
    allowedValues: Object.values(ORGANISATION_TYPES),
    uniforms: { displayEmpty: false },
  },
  features: {
    type: Array,
    optional: true,
    defaultValue: [],
    uniforms: { placeholder: null },
  },
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
  tags: {
    type: Array,
    optional: true,
    defaultValue: [],
    uniforms: { placeholder: null },
  },
  'tags.$': { type: String, allowedValues: Object.values(ORGANISATION_TAGS) },
});

Organisations.attachSchema(OrganisationSchema);
export default Organisations;
