import { Mongo } from 'meteor/mongo';

import SimpleSchema from 'simpl-schema';

import {
  address,
  percentageField,
  moneyField,
  documentsField,
} from '../helpers/sharedSchemas';
import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_TYPES,
  ORGANISATION_FEATURES,
  ORGANISATION_TAGS,
} from './organisationConstants';

// console.trace();

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
  name: {
    type: String,
    uniforms: { placeholder: 'Crédit Suisse' },
    unique: true,
  },
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
  'contactIds.$.title': { type: String, optional: true },
  'contactIds.$.useSameAddress': { type: Boolean, optional: true },
  tags: {
    type: Array,
    optional: true,
    defaultValue: [],
    uniforms: { placeholder: null },
  },
  'tags.$': { type: String, allowedValues: Object.values(ORGANISATION_TAGS) },
  userLinks: { type: Array, defaultValue: [] },
  'userLinks.$': Object,
  'userLinks.$._id': { type: String, optional: true },
  'userLinks.$.title': { type: String, optional: true },
  'userLinks.$.isMain': { type: Boolean, optional: true },
  'userLinks.$.shareCustomers': { type: Boolean, optional: true },
  commissionRates: { type: Array, defaultValue: [] },
  'commissionRates.$': Object,
  'commissionRates.$.rate': percentageField,
  'commissionRates.$.threshold': moneyField,
  documents: documentsField,
  lenderRulesCount: { type: Number, optional: true },
  adminNote: { type: String, optional: true },
});

Organisations.attachSchema(OrganisationSchema);
export default Organisations;
