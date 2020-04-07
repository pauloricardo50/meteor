import SimpleSchema from 'simpl-schema';

import { createCollection } from '../helpers/collectionHelpers';
import {
  address,
  documentsField,
  moneyField,
  percentageField,
} from '../helpers/sharedSchemas';
import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_FEATURES,
  ORGANISATION_TAGS,
  ORGANISATION_TYPES,
} from './organisationConstants';

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
  documents: documentsField,
  lenderRulesCount: { type: Number, optional: true },
  referredUsersCount: { type: Number, optional: true },
  revenuesCount: { type: Number, optional: true },
  adminNote: { type: String, optional: true },
  emails: { type: Array, defaultValue: [] },
  'emails.$': String,
  insuranceProductLinks: { type: Array, defaultValue: [] },
  'insuranceProductLinks.$': Object,
  'insuranceProductLinks.$._id': String,
});

Organisations.attachSchema(OrganisationSchema);
export default Organisations;
