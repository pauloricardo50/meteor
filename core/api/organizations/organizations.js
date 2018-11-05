import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import {
  ORGANIZATIONS_COLLECTION,
  ORGANIZATION_TYPES,
} from './organizationConstants';

const Organizations = new Mongo.Collection(ORGANIZATIONS_COLLECTION);

Organizations.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

Organizations.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

export const OrganizationSchema = new SimpleSchema({
  name: { type: String },
  type: {
    type: String,
    optional: true,
    allowedValues: Object.values(ORGANIZATION_TYPES),
  },
  logo: {
    type: String,
    optional: true,
  },
});

Organizations.attachSchema(OrganizationSchema);
export default Organizations;
