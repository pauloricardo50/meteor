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
import { createCollection } from '../helpers/collectionHelpers';

const Organisations = createCollection(ORGANISATIONS_COLLECTION);

const userLinkSchema = new SimpleSchema({
  _id: { type: String, optional: true },
  title: { type: String, optional: true },
  isMain: { type: Boolean, optional: true },
  shareCustomers: { type: Boolean, defaultValue: true },
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
  'userLinks.$': userLinkSchema,
  mainUserLinks: { type: Array, defaultValue: [] },
  'mainUserLinks.$': userLinkSchema,
  commissionRates: { type: Array, defaultValue: [] },
  'commissionRates.$': Object,
  'commissionRates.$.rate': percentageField,
  'commissionRates.$.threshold': moneyField,
  documents: documentsField,
  lenderRulesCount: { type: Number, optional: true },
  referredUsersCount: { type: Number, optional: true },
  revenuesCount: { type: Number, optional: true },
  adminNote: { type: String, optional: true },
  emails: { type: Array, defaultValue: [] },
  'emails.$': String,
});

Organisations.attachSchema(OrganisationSchema);
export default Organisations;
